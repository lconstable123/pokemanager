"use server";

import { AddPkFormSchema, EditPkFormSchema } from "./schemas";
import { string, ZodError } from "zod";
import { sleep } from "./utils";

export const AddPokemon = async (data: unknown) => {
  await sleep(1000);
  const validated = AddPkFormSchema.safeParse(data);
  let error = null;
  if (!validated.success) {
    error = validated.error.issues.map(
      (issue) => issue.path + " | " + issue.message
    );

    console.log(error);
    console.log("end error------------");

    return error;
  }

  // ✅ Valid
  console.log("✅ Validated form data:", validated.data);
};

export const EditPokemon = async (data: unknown) => {
  await sleep(1000);
  console.log("validating edit form on server ");
  const validated = EditPkFormSchema.safeParse(data);
  let error = null;
  if (!validated.success) {
    error = validated.error.issues.map(
      (issue) => issue.path + " | " + issue.message
    );

    console.log(error);
    console.log("end error------------");

    return error;
  }

  // ✅ Valid
  console.log("✅ Validated form data:", validated.data);
};

export const DeletePokemon = async (data: unknown) => {
  await sleep(1000);
};
