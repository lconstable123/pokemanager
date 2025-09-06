"use client";
import React from "react";
import { motion } from "framer-motion";
import SignUpForm from "./signup-form";
import SignInForm from "./signin-form";
import { timeOffset_1, timeOffset_2 } from "@/lib/constants";

type welcomeTextProps = {
  mode: "sign-up" | "sign-in";
};
export default function WelcomeForm({ mode }: welcomeTextProps) {
  return (
    <div className="relative flex flex-col justify-center text-center items-center ">
      <FormHeaderText mode={mode} />
      <motion.div
        initial={{ translateX: -40, opacity: 0 }}
        animate={{ translateX: 0, opacity: 1 }}
        transition={{ delay: timeOffset_2, duration: 0.4 }}
        exit={{ opacity: 0 }}
        className=" pb-0 sm:pb-0 -translate-x-0 z-3 px-10 w-80 "
      >
        {mode === "sign-up" ? (
          <SignUpForm timeOffset={timeOffset_2} />
        ) : (
          <SignInForm timeOffset={timeOffset_2} />
        )}
      </motion.div>
    </div>
  );
}

//-=----------------

function FormHeaderText({ mode }: { mode: "sign-up" | "sign-in" }) {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: timeOffset_1, duration: 0.6 }}
        className="  my-0! py-0! text-[20pt]! 2xl:text-[26pt]!"
      >
        {mode === "sign-up" ? "Welcome, trainer!" : "Welcome back, trainer!"}
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: timeOffset_2, duration: 0.8 }}
        className=" my-0!  pt-2 pb-3 sm:pb-5! pointer-events-none text-[12pt]! 2xl:text-[12pt]! "
      >
        Enter your details to get started.
      </motion.h2>
    </>
  );
}
