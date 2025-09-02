"use client";
import React from "react";
import { motion } from "framer-motion";
import Pokeform from "./signup-form";
import SignUpForm from "./signup-form";
import SignInForm from "./signin-form";
type welcomeTextProps = {
  mode: "sign-up" | "sign-in";
  timeOffsets: { timeOffset1: number; timeOffset2: number };
};
export default function WelcomeText({ mode, timeOffsets }: welcomeTextProps) {
  return (
    <div className="  relative px-3 flex flex-col justify-center text-center items-center h-100 lg:h-90 2xl:h-90   ">
      <div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: timeOffsets.timeOffset1, duration: 0.6 }}
          className=" my-0 py-0  text-[20pt]! 2xl:text-[26pt]!"
        >
          {mode === "sign-up" ? "Welcome, trainer!" : "Welcome back, trainer!"}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: timeOffsets.timeOffset2, duration: 0.8 }}
          className=" my-0 pt-1 sm:pt-2 pb-6 pointer-events-none text-[12pt]! 2xl:text-[12pt]! "
        >
          Enter your details to get started.
        </motion.h2>
      </div>
      <motion.div
        layout
        initial={{ flexGrow: 0, height: "0%", opacity: 100 }}
        animate={{ flexGrow: 1, height: "100%", opacity: 100 }}
        exit={{ opacity: 0 }}
        transition={{
          delay: timeOffsets.timeOffset2 + 0.0,

          type: "tween",
          duration: 0.5,
          ease: "easeOut",
        }}
        className="border-1  -translate-x-2 z-3  px-10 w-80  "
      >
        {mode === "sign-up" ? <SignUpForm /> : <SignInForm />}
      </motion.div>
    </div>
  );
}
