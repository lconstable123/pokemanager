"use client";
import { motion } from "framer-motion";
import { tr } from "framer-motion/client";
import React from "react";

export default function LoadingContent() {
  const ballAmt = 21;
  const loadingBalls = Array.from({ length: ballAmt }, (_, i) => i);
  const ballInc = 360 / ballAmt;
  const duration = 1.5;
  const offset = duration / ballAmt;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: 0.1,
        ease: "easeOut",
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      className="relative  w-50  h-50 rounded-full z-600 -translate-y-4  "
    >
      {loadingBalls.map((i) => (
        <div
          key={i}
          className="z-60 w-1/2 absolute  top-1/2 -translate-y-1/2 h-4 origin-right "
          style={{ transform: `rotate(${i * ballInc}deg)` }}
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: i * offset,
            }}
            className="z-90 w-3 h-3 rounded-full bg-gray-300"
          />
        </div>
      ))}
      <div className="z-50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-50 w-50 ">
        <img
          src="/placeholders/slowpoke.png"
          alt="Loading..."
          width={200}
          height={200}
          className="z-10 pixelImage -translate-y-4 animate-pulse hardSVGShadow  noSelect "
        />
        {/* <div className="scale-60 rounded-full w-full-h-full absolute inset-0 bg-gray-200 -z-20" /> */}
        <h1 className="text-gray-800 animate-pulse  absolute bottom-6 left-1/2 -translate-x-1/2 z-300  text-sm! text-center ">
          loading...
        </h1>
      </div>
    </motion.div>
  );
}
