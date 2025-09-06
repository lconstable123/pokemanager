"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AppPreview({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className={`relative overflow-hidden z-5  translate-y-0  h-80 sm:h-40   md:translate-y-[100%] pointer-events-none w-screen sm:w-full  border-t-2 lg:border-2 bg-gray-100/100 rounded-none lg:rounded-lg lg:hardShadow`}
      >
        <img
          src="/placeholders/app_placeholder.png"
          alt="App screenshot"
          className="object-contain absolute -top-0 left-0 transform-border origin-center   pointer-events-none scale-140  rotate-15 "
        />
      </motion.section>
    );
  } else {
    return (
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className={`relative overflow-hidden 
 pointer-events-none object-contain  origin-center p-0 m-0 w-[250px] 2xl:w-[350px] h-[250px] 2xl:h-[300px] imageFrame`}
      >
        <img
          src="/placeholders/app_placeholder.png"
          alt="App screenshot"
          className="pointer-events-none scale-150 sm:scale-250 rotate-15 group-hover:scale-170"
        />
      </motion.section>
    );
  }
}
