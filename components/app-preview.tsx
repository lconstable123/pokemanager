"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AppPreview({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 1 }}
        className={`relative overflow-hidden z-5  translate-y-0  h-80 sm:h-40   md:translate-y-[100%] pointer-events-none w-screen sm:w-full  border-t-2 lg:border-2 border-black/60 bg-gray-100/100 rounded-none lg:rounded-lg lg:hardShadow`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 to-yellow-500/30 z-30"></div>
        <img
          src="/placeholders/app_placeholder.png"
          alt="App screenshot"
          className="object-contain absolute -top-0 left-0 transform-border origin-center    pointer-events-none scale-170  rotate-5 "
        />
      </motion.section>
    );
  } else {
    return (
      <motion.section
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "tween",

          duration: 0.5,
        }}
        className={`relative overflow-hidden 
 pointer-events-none  p-0 m-1  opacity-0 lg:opacity-100 lg:w-[450px]  w-0  h-0  mb-1 lg:h-[250px] 
 imageFrame`}
      >
        {/* <h2 className="font-semibold! text-gray-800! text-[8pt]! w-full bg-white border-t-2 border-b-2    z-32 absolute -bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center  ">
          Find and take care of your lineup.
        </h2> */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 to-yellow-400/30 z-30"></div>
        <img
          src="/placeholders/app_placeholder.png"
          alt="App screenshot"
          className=" scale-190 sm:scale-160 md:scale-200 rotate-5 -translate-y-6 md:translate-y-7 group-hover:scale-190 "
        />
      </motion.section>
    );
  }
}
