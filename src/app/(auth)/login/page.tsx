"use client";
import React from "react";
import WindowBg from "../../../../components/window-bg/window-bg";
import EntryWindow from "../../../../components/entry-window";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { Urls_login } from "@/lib/data";
import { useMultipleImageLoader } from "@/lib/useImageLoader";

export default function Page() {
  const imagesLoaded = useMultipleImageLoader(Urls_login);
  const { isMobile } = usePokeAppContext();
  return (
    <>
      <section className=" relative flex flex-col -translate-y-2 items-center justify-center h-full ">
        {imagesLoaded ? (
          // <div />
          <EntryWindow mode="sign-in" isMobile={isMobile} />
        ) : (
          <div className=" h-[712px] sm:h-full w-full flex justify-center items-center ">
            {/* <LoadingContent /> */}
          </div>
        )}
        <WindowBg image="Gengar" />
      </section>
    </>
  );
}
