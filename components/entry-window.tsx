"use client";
import React from "react";
import { motion } from "framer-motion";
import SignUpForm from "./signup-form";
import SignInForm from "./signin-form";
import { timeOffset_1, timeOffset_2, timeOffset_3 } from "@/lib/constants";
import SelectTrainer from "./select-trainer";

import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
type welcomeTextProps = {
  mode: "sign-up" | "sign-in";
  isMobile: boolean;
};

export default function EntryContent({ mode }: welcomeTextProps) {
  const { isMobile } = usePokeAppContext();
  return (
    <FormStyle>
      <WelcomeForm mode={mode} isMobile={isMobile} />
      {!isMobile && <SelectTrainer mode={mode} />}
    </FormStyle>
  );
}

//---------------------------------------------------

function FormStyle({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-full flex flex-col items-center justify-center w-full">
      <div className="mt-10 sm:mt-0 mb-30 sm:mb-10 relative px-10  md:px-40  flex flex-col sm:flex-row justify-around items-center">
        {children}
      </div>
    </section>
  );
}

function WelcomeForm({ mode, isMobile }: welcomeTextProps) {
  return (
    <div className="relative  flex flex-col justify-center text-center items-center ">
      <FormHeaderText mode={mode} />
      <motion.div
        initial={
          !isMobile
            ? { translateX: -40, opacity: 0 }
            : { translateX: 0, opacity: 0 }
        }
        animate={{ translateX: 0, opacity: 1 }}
        transition={{ delay: timeOffset_3, duration: 0.4 }}
        exit={{ opacity: 0 }}
        className="pb-0 sm:pb-0 -translate-x-0 z-3 px-5 sm:px-10 w-80 sm:w-90 "
      >
        {mode === "sign-up" ? <SignUpForm /> : <SignInForm />}
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
        className="pb-3 sm:pb-5!  my-0! py-0! w-80 md:w-100  lg:w-110 text-[20pt]! 2xl:text-[26pt]!"
      >
        {mode === "sign-up" ? "Welcome, trainer!" : "Welcome back, trainer!"}
      </motion.h1>
    </>
  );
}
