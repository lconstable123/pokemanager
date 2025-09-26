"use client";
import React from "react";
import WindowBg from "../../../../components/window-bg/window-bg";
import EntryWindow from "../../../../components/entry-window";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";

export default function Page() {
  const { isMobile } = usePokeAppContext();
  return (
    <section className="flex flex-col -translate-y-2 items-center justify-center h-full ">
      <EntryWindow mode="sign-in" isMobile={isMobile} />
      <WindowBg image="Gengar" />
    </section>
  );
}
