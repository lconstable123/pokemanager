"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Nav from "./nav";
import { cn, generateRandomTrainer } from "@/lib/utils";
import Pokeball from "./pokeball";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SubmitButton from "./submit-button";
import FormErrorMessage from "./form-error-message";
import { time } from "console";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import SelectTrainer from "./select-trainer";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import {
  UserFormSchemaFull,
  UserFormSchema,
  UserFormInput,
  UserFormData,
} from "@/lib/schemas";
import { ZodSchema } from "zod/v3";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
export default function SignUpForm({ timeOffset }: { timeOffset: number }) {
  const { isMobile } = usePokeAppContext();
  const router = useRouter();
  const { selectedFormTrainer } = usePokeAppContext();
  //---------------------------------------------------------------handles
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Successfully signed in!");
    // validate, send request, etc.
    router.push("/account");
  };

  const updateField = (field: keyof UserFormInput, value: any) => {
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  const { randomTrainer, randomEmail, randomPassword } =
    generateRandomTrainer();

  const {
    register,
    // handleSubmit,
    trigger,
    control,
    getValues,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<UserFormInput>({
    resolver: zodResolver(UserFormSchemaFull),
    defaultValues: {
      name: randomTrainer,
      email: randomEmail,
      password: "password123",
      repeatPassword: "password12",
    },
  });

  return (
    <form
      action={async () => {
        const id = uuidv4();
        const values = getValues();
        updateField("avatar", selectedFormTrainer);
        updateField("id", id);
        console.log(values);
        console.log(errors);
        const isValid = await trigger();
        if (!isValid) {
          toast.error("Please fix the errors in the form.");
          return;
        }
        toast.success("Successfully signed in!");
        // validate, send request, etc.
        router.push("/account");
      }}
      // onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center "
    >
      {isMobile && <SelectTrainer mode={"sign-up"} />}
      <div className=" mb-6 w-full items-center justify-end text-right grid grid-rows-4 grid-cols-[1fr_4fr] gap-y-5 gap-x-4">
        <Label className="justify-self-end " htmlFor="name">
          Name
        </Label>
        <div className="relative">
          <Input
            {...register("name")}
            id="name"
            defaultValue={getValues("name") || ""}
          />
          {errors.name && (
            <FormErrorMessage message={errors?.name?.message || ""} />
          )}
        </div>
        <Label className="justify-self-end" htmlFor="email">
          Email
        </Label>
        <div className="relative">
          <Input
            className="text-[8pt]!"
            {...register("email")}
            id="email"
            placeholder=""
            defaultValue={getValues("email") || ""}
          />
          {errors.email && (
            <FormErrorMessage message={errors?.email?.message || ""} />
          )}
        </div>
        <Label className="justify-self-end self-center" htmlFor="password">
          Password
        </Label>
        <div className="relative">
          <Input
            {...register("password")}
            id="password"
            defaultValue={getValues("password") || ""}
          />
          {errors.password && (
            <FormErrorMessage message={errors?.password?.message || ""} />
          )}
        </div>
        <Label
          className="justify-self-end self-center"
          htmlFor="repeat-password"
        >
          Repeat Password
        </Label>
        <div className="relative">
          <Input
            {...register("repeatPassword")}
            id="repeat-password"
            defaultValue={getValues("repeatPassword") || ""}
          />
          <FormErrorMessage message={errors?.repeatPassword?.message || ""} />
        </div>
      </div>
      <SubmitButton type="submit" ball="02" name="Submit" onSubmit={() => {}} />
    </form>
  );
}
