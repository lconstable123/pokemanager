"use client";
import React from "react";

import WindowBg from "../../../../components/window-bg/window-bg";

import EntryWindow from "../../../../components/entry-window";

export default function Page() {
  return (
    <section className="flex flex-col -translate-y-2 items-center justify-center h-full ">
      <EntryWindow mode="sign-in" />
      <WindowBg image="Charizard" />
    </section>
  );
}
