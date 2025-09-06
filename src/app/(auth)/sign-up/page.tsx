"use client";
import React from "react";
import MainWindow from "../../../../components/main-window";
import WindowBg from "../../../../components/window-bg/window-bg";
import EntryWindow from "../../../../components/entry-window";
import Canvas from "../../../../components/canvas";
import EntryContent from "../../../../components/entry-window";
export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center h-full ">
      <EntryContent mode="sign-up" />
      <WindowBg image="Pikachu" />
    </section>
  );
}
