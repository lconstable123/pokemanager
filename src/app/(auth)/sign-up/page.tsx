"use client";
import React from "react";
import MainWindow from "../../../../components/main-window";
import WindowBg from "../../../../components/window-bg/window-bg";
import EntryWindow from "../../../../components/entry-window";
import Canvas from "../../../../components/canvas";
import EntryContent from "../../../../components/entry-window";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { useMultipleImageLoader } from "@/lib/useImageLoader";
import LoadingContent from "../../../../components/loading-content";
import { Urls_login } from "@/lib/data";
export default function Page() {
  const { isMobile } = usePokeAppContext();
  const imagesLoaded = useMultipleImageLoader(Urls_login);
  return (
    <section className="flex flex-col items-center justify-center h-full ">
      {imagesLoaded ? (
        <EntryWindow mode="sign-up" isMobile={isMobile} />
      ) : (
        <div className="w-full flex justify-center items-center h-full">
          <LoadingContent />
        </div>
      )}
      <WindowBg image="Pikachu" />
    </section>
  );
}
