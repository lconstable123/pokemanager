import React from "react";
import Canvas from "../../../../components/canvas";
import MainWindow from "../../../../components/main-window";
import WindowBg from "../../../../components/window-bg/window-bg";
import BackButton from "../../../../components/back-button";
import TrainerContextProvider from "@/lib/contexts/TrainerContext";
import NavBar from "../../../../components/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TrainerContextProvider>{children}</TrainerContextProvider>
      <WindowBg image="Pikachu" />
    </>
  );
}
