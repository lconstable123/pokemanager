"use client";
import React, { useEffect, useState } from "react";
import WindowBg from "./window-bg/window-bg";
import { motion } from "framer-motion";
export default function MainWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  // const dimensions = " ";
  return (
    <main className="hardShadow flex flex-col w-screen sm:w-[95vw] md:w-[700px] lg:w-[800px] 2xl:w-[1000px] overflow-hidden rounded-none sm:rounded-2xl">
      <FrameBar />
      <div
        className={` bg-white h-full sm:h-[550px]  w-full relative flex flex-col`}
      >
        {children}
      </div>
      <FrameBar />
    </main>
  );
}

function FrameBar() {
  return <div className="bg-red-900 h-5 w-full" />;
}
