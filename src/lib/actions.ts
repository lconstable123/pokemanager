"use server";

import {
  AddPkFormSchema,
  EditPkFormSchema,
  SignInFormSchema,
  UserFormSchema,
} from "./schemas";

import { sleep } from "./utils";
import prisma from "./prisma";
import bcrypt from "bcrypt";

import { ServerTrainerWithLineup, TLineUp, TServerPK } from "./types";
import { get } from "http";
import { Trainer } from "@/generated/prisma/wasm";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
export const FetchTrainerById = async (
  id: string
): Promise<{ trainer: ServerTrainerWithLineup | null; error: string }> => {
  try {
    const trainer = await prisma.trainer.findFirst({
      where: { id: id },
      include: { lineup: true },
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
    userId: newPk.Trainer,
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
  const pokemonData: Omit<TServerPK, "id" | "ball" | "userId"> = {
    name: newPk.Name,
    species: newPk.Pokemon,
    exp: newPk.Xp,
    types: JSON.stringify(newPk.Type),
    sprite: newPk.Sprite,
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

export const RearrangePokemon = async () => {
  await sleep(500);

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

const FindTrainerByEmail = async (email: string, includePk = false) => {
  const existingTrainer = prisma.trainer.findFirst({
    where: { email: email },
    include: { lineup: includePk },
  });
  return existingTrainer;
};

export const SignInTrainer = async (data: unknown) => {
  // const { handleSignIn } = useTrainerContext();
  await sleep(500);
  const validatedTrainer = SignInFormSchema.safeParse(data);
  let error = null;
  if (!validatedTrainer.success) {
    error = validatedTrainer.error.issues.map(
      (issue) => issue.path + " | " + issue.message
    );
  }
  const trainerData = validatedTrainer.data!;
  const existingTrainer = await FindTrainerByEmail(trainerData.email, true);
  if (!existingTrainer) {
    console.log("No trainer found with that email");
    return {
      trainer: null,
      error: { message: "No trainer found with that email" },
    };
  } else {
    const passwordMatch = await bcrypt.compare(
      trainerData.password,
      existingTrainer.hashedPassword
    );
    if (!passwordMatch) {
      console.log("Incorrect password");
      return { trainer: null, error: { message: "Incorrect password" } };
    }

    const lineUpFromServer = existingTrainer.lineup.map((pk) => ({
      ...pk,
      type: JSON.parse(pk.types),
    }));
    const trainerDataPrepped = {
      id: existingTrainer.id,
      name: existingTrainer.name,
      email: existingTrainer.email,
      avatar: existingTrainer.avatar,
      lineup: lineUpFromServer,
    };
    return { trainer: trainerDataPrepped, error: null };
    // setTrainer(trainerDataPrepped);
  }
};
