"use client";
import { motion } from "framer-motion";
import React from "react";

export default function LoadingContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1, ease: "easeOut", type: "tween" }}
      className="relative    w-40 h-40 rounded-full z-600 -translate-y-4  "
    >
      <img
        src="/placeholders/slowpoke.png"
        alt="Loading..."
        width={300}
        height={300}
        className="pixelImage animate-pulse hardSVGShadow  noSelect absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-22"
      />
      <h1 className="px-4    py-0 rounded-full absolute z-300 bottom-0 text-sm! text-center -translate-x-1/2 left-1/2">
        loading...
      </h1>
    </motion.div>
  );
}
