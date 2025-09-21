"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Nav from "./nav";
import { cn } from "@/lib/utils";
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
export default function SignUpForm({ timeOffset }: { timeOffset: number }) {
  const { isMobile } = usePokeAppContext();
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Successfully signed in!");
    // validate, send request, etc.
    router.push("/account");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center "
    >
      {isMobile && <SelectTrainer mode={"sign-up"} />}
      <div className=" mb-6 w-full items-center justify-end text-right grid grid-rows-4 grid-cols-[1fr_4fr] gap-y-5 gap-x-4">
        <Label className="justify-self-end " htmlFor="name">
          Name
        </Label>
        <div className="relative">
          <Input placeholder="" />
          <FormErrorMessage message="Name is required" />
        </div>
        <Label className="justify-self-end" htmlFor="email">
          Email
        </Label>
        <div className="relative">
          <Input placeholder="" />
          <FormErrorMessage message="Email is required" />
        </div>
        <Label className="justify-self-end self-center" htmlFor="password">
          Password
        </Label>
        <div className="relative">
          <Input placeholder="" />
          <FormErrorMessage message="Password is required" />
        </div>
        <Label
          className="justify-self-end self-center"
          htmlFor="repeat-password"
        >
          Repeat Password
        </Label>
        <div className="relative">
          <Input placeholder="" />
          <FormErrorMessage message="Password is not the same" />
        </div>
      </div>
      <SubmitButton type="submit" ball="02" name="Submit" onSubmit={() => {}} />
    </form>
  );
}
