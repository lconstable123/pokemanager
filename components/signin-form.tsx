"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "./submit-button";
import FormErrorMessage from "./form-error-message";
import SelectTrainer from "./select-trainer";
import { useRouter } from "next/navigation";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { SignInFormData, SignInFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInTrainer } from "@/lib/actions";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
export default function SignInForm({ timeOffset }: { timeOffset: number }) {
  const { isMobile } = usePokeAppContext();
  const { handleSignIn } = useTrainerContext();
  const router = useRouter();

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "ash.ketchum@example.com",
      password: "password",
    },
    resolver: zodResolver(SignInFormSchema),
  });

  return (
    <form
      action={async () => {
        const values = getValues();
        console.log("Form Values:", values);
        // toast.success("Submitting...");
        const isValid = await trigger();
        if (!isValid) {
          toast.error("Please fix the errors in the form.");
          return;
        } else {
          const { trainer, error } = await SignInTrainer(values);
          if (error) {
            toast.error(error.message);
            return;
          } else {
            handleSignIn(trainer);
          }
          // toast.success("Successfully signed in!");
          router.push("/account");
        }
      }}
      className=" flex flex-col items-center justify-center "
    >
      {isMobile && (
        <div className="mb-4">
          <SelectTrainer mode={"sign-in"} />
        </div>
      )}
      <div className="mt-1 mb-6 w-full items-center justify-end text-right grid grid-rows-2 grid-cols-[1fr_4fr] gap-y-5 gap-x-4">
        <Label className="justify-self-end" htmlFor="email">
          Email
        </Label>
        <div className="relative">
          <Input
            {...register("email")}
            id="email"
            defaultValue={getValues("email")}
          />
          {errors.email && (
            <FormErrorMessage message={errors.email?.message || ""} />
          )}
        </div>
        <Label className="justify-self-end self-center" htmlFor="password">
          Password
        </Label>
        <div className="relative">
          <Input
            {...register("password")}
            id="password"
            defaultValue={getValues("password")}
          />
          {errors.password && (
            <FormErrorMessage message={errors.password?.message || ""} />
          )}
        </div>
      </div>
      <SubmitButton
        ball="02"
        name="Submit"
        type="submit"
        // onClick={() => toast.success("clicked button")}
      />
    </form>
  );
}
