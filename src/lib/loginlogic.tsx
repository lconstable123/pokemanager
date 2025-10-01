import { signIn } from "next-auth/react";
import { SignInFormSchema } from "./schemas";

export const SignInTrainer2 = async (data: unknown) => {
  const validatedTrainer = SignInFormSchema.safeParse(data);
  if (!validatedTrainer.success) {
    return {
      message: validatedTrainer.error.issues
        .map((issue) => `${issue.path} | ${issue.message}`)
        .join(", "),
    };
  }

  const trainerData = validatedTrainer.data;

  const res = await signIn("credentials", {
    ...trainerData,
    redirect: false, // important
  });

  if (res?.error) return { message: res.error };

  return { success: true };
};
