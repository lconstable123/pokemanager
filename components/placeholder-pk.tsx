"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
export default function PlaceholderPk({
  text,
  loading = false,
  userJourney,
}: {
  text: string;
  loading?: boolean;
  userJourney?: "initial" | "addpk" | "addname";
}) {
  return (
    <>
      {!loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="softSVGShadow  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-white! tracking-widest! text-[11pt] text-center w-40"
        >
          {text}
        </motion.p>
      )}

      {loading && userJourney !== "initial" && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0, duration: 0.2 }}
          className="animate-pulse softSVGShadow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-white! tracking-widest! text-[11pt] text-center w-40"
        >
          Loading Image...
        </motion.p>
      )}
      {loading && userJourney === "initial" && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0, duration: 0.2 }}
          className="animate-pulse softSVGShadow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-white! tracking-widest! text-[11pt] text-center w-40"
        >
          Select an Image...
        </motion.p>
      )}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.6 }}
        src={`/placeholders/placeholder_pk.png`}
        width={180}
        height={180}
        className={cn(
          " pixelImage absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        )}
      />
    </>
  );
}
