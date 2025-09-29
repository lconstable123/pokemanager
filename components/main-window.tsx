"use client";
import React, { useEffect, useState } from "react";
import WindowBg from "./window-bg/window-bg";
import { motion } from "framer-motion";
import PsyduckServer from "./psyduck-server";
import { Urls_1, Urls_2 } from "@/lib/data";
import usePrioritizedMultiImageLoader from "@/lib/useImageLoader";
import { useFontsLoaded } from "@/lib/hooks";
import { cn } from "@/lib/utils";

export default function MainWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  const assetsLoaded = usePrioritizedMultiImageLoader({
    Primaryurls: Urls_1,
    SecondaryUrls: Urls_2,
  });

  return (
    <>
      {assetsLoaded && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", type: "tween" }}
          className="relative flex flex-col w-screen sm:w-[95vw] md:w-[700px] lg:w-[800px] 2xl:w-[1000px] "
        >
          <div className="border-3 border-black outline-4 outline-red-800  hardShadow overflow-hidden rounded-none sm:rounded-lg">
            <PsyduckServer />
            {/* <div
              onClick={() => {
                // handleClick();
              }}
              className={cn(
                "z-30 absolute duration-400 top-0 right-0 hover:scale-110 scale-100 transition-all border-1 border-gray-700 overflow-hidden  rounded-full bg-red-300",
                "hover:w-30 hover:h-30",
                "w-11 h-11"
              )}
            >
              <img
                src={"dd"}
                alt="Trainer"
                className="absolute object-cover -top-3 w-20 h-20"
              />
            </div> */}
            <FrameBar />

            <div
              className={` bg-white  h-full sm:h-[550px]  w-full relative flex flex-col`}
            >
              {children}
            </div>
            <FrameBar />
          </div>
        </motion.main>
      )}
    </>
  );
}

function FrameBar() {
  return <div className="bg-red-900 h-5 w-full" />;
}
