"use client";
import React from "react";
import MainWindow from "../../../../components/main-window";
import WindowBg from "../../../../components/window-bg/window-bg";
import BackButton from "../../../../components/back-button";
import SelectTrainer from "../../../../components/select-trainer";
import WelcomeText from "../../../../components/welcome-text";
import EntryWindow from "../../../../components/entry-window";
import { motion } from "framer-motion";
export default function Page() {
  return (
    <div className=" w-screen h-screen flex justify-center items-center">
      <MainWindow>
        <EntryWindow mode="sign-in" />
        <WindowBg image="Charizard" />
      </MainWindow>
    </div>
  );
}
