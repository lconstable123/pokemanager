"use client";
import React from "react";
import WindowBg from "../../../../components/window-bg/window-bg";
import EntryWindow from "../../../../components/entry-window";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { Urls_login } from "@/lib/data";
import { useMultipleImageLoader } from "@/lib/useImageLoader";
import LoadingContent from "../../../../components/loading-content";
export default function Page() {
  const imagesLoaded = useMultipleImageLoader(Urls_login);
  const { isMobile } = usePokeAppContext();
  return (
    <section className="flex flex-col -translate-y-2 items-center justify-center h-full ">
      {imagesLoaded ? (
        <EntryWindow mode="sign-in" isMobile={isMobile} />
      ) : (
        <div className="w-full flex justify-center items-center h-full">
          <LoadingContent />
        </div>
      )}
      <WindowBg image="Gengar" />
    </section>
  );
}
