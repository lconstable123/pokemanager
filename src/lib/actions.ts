"use server";

import { AddPkFormSchema } from "./schemas";
import { string, ZodError } from "zod";

export const handleAddPokemon = async (data: unknown) => {
  const validated = AddPkFormSchema.safeParse(data);

  if (!validated.success) {
    const error = validated.error.issues.map(
      (issue) => issue.path + " | " + issue.message
    );
    // const messages = error?.issues.map((issue) => issue.message);

    console.log(error);
    console.log("end error------------");
    // Log each error message

    // Optional: return error messages to the caller
    return;
  }

  // ✅ Valid
  console.log("✅ Validated form data:", validated.data);

  return { success: true, data: validated.data };
};
