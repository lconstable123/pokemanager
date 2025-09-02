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
export default function SignInForm() {
  return (
    <motion.div
      initial={{ translateX: -40, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      exit={{ opacity: 0 }}
    >
      <form className=" flex flex-col items-center justify-center ">
        <div className="mb-6 w-full items-center justify-end text-right grid grid-rows-2 grid-cols-[1fr_4fr] gap-y-5 gap-x-4">
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
        </div>
        <SubmitButton ball="02" name="Submit" onSubmit={() => {}} />
      </form>
    </motion.div>
  );
}
