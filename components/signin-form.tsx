"use client";
import React, { useEffect, useState, useTransition } from "react";
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
import { useFormState } from "react-dom";
import { signIn } from "@/lib/auth";
import { tr } from "framer-motion/client";
import { motion, useAnimate, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";
import { set } from "zod";
import { start } from "repl";
export default function SignInForm({ timeOffset }: { timeOffset: number }) {
  const { isMobile } = usePokeAppContext();
  const { handleSignIn } = useTrainerContext();
  const controls = useAnimation();

  const handleAnimateError = () => {
    setInvalidInput(true);
    setTimeout(() => setInvalidInput(false), 400);
    controls.start({
      x: [0, -7, 12, -10, 4, 0],
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  };

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
  const [isPending, startTransition] = useTransition();
  const [invalidInput, setInvalidInput] = useState(false);
  // const [signUpError] = useFormState();

  return (
    <motion.form
      animate={controls}
      action={async () => {
        startTransition(async () => {
          const values = getValues();
          const isValid = await trigger();
          if (!isValid) {
            toast.error("Please fix the errors in the form.");
            return;
          } else {
            const trainer = await SignInTrainer(values);
            if (trainer?.message) {
              toast.error(trainer.message || "Failed to sign in");
              handleAnimateError();
            } else {
              toast.success("Successfully signed in");

              router.push("/account");
            }
          }
        });
      }}
      className={cn(
        "transition-opacity flex-col items-center justify-center ",
        isPending === true && "opacity-70 pointer-events-none"
      )}
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
            className={cn(
              "transition-all duration-600",
              invalidInput ? "border-red-500 bg-red-100" : "bg-white"
            )}
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
            className={cn(
              "transition-all duration-600",
              invalidInput ? "border-red-500 bg-red-100" : "bg-white"
            )}
          />
          {errors.password && (
            <FormErrorMessage message={errors.password?.message || ""} />
          )}
        </div>
      </div>
      {/* {signUpError && <div className="text-red-500">{signUpError}</div>} */}
      <SubmitButton
        ball="02"
        name="Submit"
        type="submit"
        // onClick={() => toast.success("clicked button")}
      />
    </motion.form>
  );
}
