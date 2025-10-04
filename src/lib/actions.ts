"use server";

import {
  AddPkFormSchema,
  EditPkFormSchema,
  SignInFormSchema,
  TLineUpSchema,
  UserFormSchema,
} from "./schemas";

import { sleep } from "./utils";
import prisma from "./prisma";
import bcrypt from "bcrypt";

import { ServerTrainerWithLineup, TLineUp, TServerPK } from "./types";

import { revalidatePath } from "next/cache";
import { signIn, signOut } from "./auth";
import { AuthError } from "next-auth";
import { redirect } from "next/dist/server/api-utils";

export async function logIn(authData: unknown) {
  const data = JSON.parse(authData as string);
  console.log("Logging in with data:", data);
}

export const FetchTrainerById = async (
  id: string
): Promise<{ trainer: ServerTrainerWithLineup | null; error: string }> => {
  // await sleep(2000);
  try {
    const trainer = await prisma.trainer.findFirst({
      where: { id },
      include: {
        lineup: {
          orderBy: { order: "asc" },
        },
      },
    });
    if (!trainer) return { trainer: null, error: "Trainer not found" };
    return { trainer, error: "" };
  } catch (error) {
    console.error("Error fetching trainer by ID:", error);
    return { trainer: null, error: "Error fetching trainer" };
  }
};

export const AddPokemon = async (data: unknown, id: string) => {
  await sleep(500);

  // validating form data from frontend
  const validated = AddPkFormSchema.safeParse(data);
  let error = null;
  if (!validated.success) {
    error = validated.error.issues.map(
      (issue) => issue.path + " | " + issue.message
    );
    return { message: "Validation errors", details: error };
  }
  const newPk = validated.data;

  // transform data to match db schema

  const pokemonData: TServerPK = {
    id: id,
    name: newPk.Name,
    species: newPk.Pokemon,
    exp: newPk.Xp,
    types: JSON.stringify(newPk.Type),
    ball: newPk.Ball as string,
    sprite: newPk.Sprite,
    spriteBack: newPk.SpriteBack,
    userId: newPk.Trainer,
    order: newPk.Order,
  };

  // insert into db

  try {
    const addedpk = await prisma.pokemon.create({
      data: pokemonData,
    });
    console.log("Added pokemon with id:", addedpk.id);
  } catch (error) {
    console.error("Error adding pokemon:", error);
    return { message: "Failed to add pokemon" };
  }

  revalidatePath("/", "layout");
};

export const EditPokemon = async (
  data: unknown
): Promise<{ message: string } | null> => {
  await sleep(1000);

  //vaildating form data from frontend

  // console.log("validating edit form on server " + data);
  const validated = EditPkFormSchema.safeParse(data);
  let error = null;
  if (!validated.success) {
    error = validated.error.issues.map(
      (issue) => issue.path + " | " + issue.message
    );
    console.log(error);
    console.log("end error------------");
    return { message: error.flat().join(", ") };
  }
  const newPk = validated.data;
  const pokemonData: Omit<TServerPK, "id" | "ball" | "userId" | "order"> = {
    name: newPk.Name,
    species: newPk.Pokemon,
    exp: newPk.Xp,
    types: JSON.stringify(newPk.Type),
    sprite: newPk.Sprite,
    spriteBack: newPk.SpriteBack,
  };
  try {
    await prisma.pokemon.update({
      where: { id: newPk.Id },
      data: { ...pokemonData },
    });
  } catch (error) {
    console.error("Error editing pokemon:", error);
    return { message: "Failed to edit pokemon" };
  }

  revalidatePath("/", "layout");
  console.log("✅ Validated form data:", validated.data);
  return null;
};
//---------------------------------------------------------------------DELETE PK
export const DeletePokemon = async (
  id: string
): Promise<{ message: string } | null> => {
  await sleep(1000);
  console.log(`deleting pk with id of ${id} on server `);

  try {
    await prisma.pokemon.delete({ where: { id: id } });
  } catch (error) {
    console.error("Error deleting pokemon:", error);
    return { message: "Failed to delete pokemon" };
  }

  console.log("Deleted pokemon with id:", id);
  revalidatePath("/", "layout");
  return null;
};

//--------------------------------------------------------------------ReArrange PK
export const RearrangePokemon = async (data: unknown) => {
  await sleep(500);
  console.log("Rearranging lineup on server:", data);
  const ValidLineup = TLineUpSchema.safeParse(data);

  if (!ValidLineup.success) {
    console.error("Invalid lineup:", ValidLineup.error);
    // revalidatePath("/", "layout");
    return { message: "Invalid lineup" };
  }
  const lineUpData = ValidLineup.data;

  try {
    await prisma.$transaction(
      lineUpData.map((pokemon, index) =>
        prisma.pokemon.update({
          where: { id: pokemon.id },
          data: { order: index }, // set new order
        })
      )
    );
  } catch (error) {
    console.error("Error rearranging pokemon:", error);
    revalidatePath("/", "layout");
    return { message: "Failed to rearrange pokemon" };
  }
  console.log("Rearranging pokemon");
  revalidatePath("/", "layout");
  return null;
};

//---------------------------------------------------------------------TRAINER
export const AddTrainer = async (data: unknown) => {
  await sleep(500);
  const validatedTrainer = UserFormSchema.safeParse(data);
  let error = null;
  if (!validatedTrainer.success) {
    error = validatedTrainer.error.issues.map(
      (issue) => issue.path + " | " + issue.message
    );
  }

  console.log("Validated form data on server:", validatedTrainer);
  const trainerData = validatedTrainer.data!;

  const existingTrainer = await FindTrainerByEmail(
    validatedTrainer.data?.email || ""
  );
  if (existingTrainer) {
    console.log("Trainer already exists with that email");
    return { message: "Trainer already exists with that email" };
  }
  try {
    const hash = await bcrypt.hash(trainerData?.password, 10);
    const newTrainer = await prisma.trainer.create({
      data: {
        name: trainerData?.name,
        email: trainerData?.email,
        avatar: trainerData?.avatar,
        hashedPassword: hash,
        lineup: { create: [] },
      },
    });
  } catch (error) {
    console.error("Error adding trainer:", error);
    return { message: "Failed to create trainer" };
  }
};

export const DeleteTrainer = async (email: string) => {
  await sleep(500);
  const existingTrainer = await FindTrainerByEmail(email);
  if (!existingTrainer) {
    console.log("No trainer found with that email");
    return { message: "No trainer found with that email" };
  } else {
    try {
      await prisma.trainer.delete({ where: { email: email } });
    } catch (error) {
      console.error("Error deleting trainer:", error);
      return { message: "Failed to delete trainer" };
    } finally {
      console.log("Trainer deleted");
    }
  }
};

export const FindTrainerByEmail = async (email: string, includePk = false) => {
  const existingTrainer = prisma.trainer.findFirst({
    where: { email: email },
    include: { lineup: includePk },
  });
  return existingTrainer;
};
//---------------------------------------------------------------------SIGN IN

export const SignInTrainer = async (data: unknown) => {
  // await sleep(500);
  console.log("Signing in with data:", data);
  const validatedTrainer = SignInFormSchema.safeParse(data);
  let error = null;
  if (!validatedTrainer.success) {
    error = validatedTrainer.error.issues.map(
      (issue) => issue.path + " | " + issue.message
    );
    console.log("Validation errors:", error);
  }
  const trainerData = validatedTrainer.data!;
  try {
    await signIn("credentials", { ...trainerData, redirect: false });
    console.log("Sign in function completed");
    // await sleep(500);
    console.log("Sign in successful, revalidating path");
    revalidatePath("/account");
    // revalidatePath("/", "layout");
  } catch (error) {
    revalidatePath("/account");
    // revalidatePath("/", "layout");
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials.",
          };
        }
        default: {
          return {
            message: "Error. Could not sign in.",
          };
        }
      }
    }
    console.error("Error signing in:");
    throw new Error("Sign in failed"); // nextjs redirects throws error, so we need to rethrow it
  }
  console.log("Sign in function completed without error");
  revalidatePath("/account", "layout");
  revalidatePath("/", "layout");
};

export async function revalidateAccountLayout() {
  console.log("Revalidating /account layout");
  revalidatePath("/account", "layout");
}

//---------------------------------------------------------------------SIGN OUT

export const SignOutTrainer = async () => {
  "use server";
  // await sleep(500);
  console.log("Signing out and revalidating path");
  await signOut({ redirect: false });
  revalidatePath("/account");
};
