"use client";
import React, { useEffect, useState } from "react";
import WindowBg from "./window-bg/window-bg";
import { motion, useAnimation } from "framer-motion";
import PsyduckServer from "./psyduck-server";
import { Urls_1, Urls_2 } from "@/lib/data";
import usePrioritizedMultiImageLoader, {
  useSingleImageLoader,
} from "@/lib/useImageLoader";
import { useFontsLoaded } from "@/lib/hooks";
import { cn, sleep } from "@/lib/utils";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { usePathname } from "next/navigation";
import { is } from "zod/v4/locales";

export default function MainWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  const assetsLoaded = usePrioritizedMultiImageLoader({
    Primaryurls: Urls_1,
    SecondaryUrls: Urls_2,
  });
  const { pageAnimControls, trainer } = usePokeAppContext();

  const pathname = usePathname();
  const isAccount = pathname === "/account";
  const isLoaded = useSingleImageLoader("/placeholders/pd_norm.png");
  return (
    <>
      {assetsLoaded && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", type: "tween" }}
          className="z-20 relative flex flex-col  w-screen sm:w-[95vw] md:w-[700px] lg:w-[800px] 2xl:w-[1000px] "
        >
          <div className=" bg-white border-0 sm:border-3 border-black outline-4 outline-red-800  hardShadow overflow-hidden rounded-none sm:rounded-lg">
            {isAccount && isLoaded && trainer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <PsyduckServer />
              </motion.div>
            )}
            <FrameBar />

            <motion.div
              animate={pageAnimControls}
              className={`h-full sm:h-[550px]  w-full relative flex flex-col`}
            >
              {children}
            </motion.div>
            <FrameBar />
          </div>
        </motion.main>
      )}
    </>
  );
}

function FrameBar() {
  return (
    <div className=" z-60 opacity-0 sm:opacity-100 bg-red-200 h-5 w-full" />
  );
}
