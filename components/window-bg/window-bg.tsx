"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

type WindowBgProps = {
  image: "Snorlax" | "Charizard" | "Pikachu" | "Gengar";
  pos?: "high" | "low" | "mid";
};

export default function WindowBg({ image, pos = "low" }: WindowBgProps) {
  const getImageSrc = (
    image: "Snorlax" | "Charizard" | "Pikachu" | "Gengar"
  ) => {
    switch (image) {
      case "Snorlax":
        return "/08 - Snorlax.svg";
      case "Charizard":
        return "/06 - Charizard.svg";
      case "Pikachu":
        return "/01 - Pikachu.svg";
      case "Gengar":
        return "/05 - Gengar.svg";
    }
  };

  return (
    <motion.img
      initial={{ scale: 1.1, opacity: 0 }}
      animate={
        pos === "low"
          ? { scale: 1, opacity: 0.03 }
          : { scale: 1, opacity: 0.02 }
      }
      transition={{ duration: 1, ease: "easeOut" }}
      src={getImageSrc(image)}
      width={6000}
      height={300}
      className={cn(
        "z-1 absolute scale-[150%] md:scale-120 pointer-events-none",
        pos === "low" && "sm:-translate-x-40 -translate-x-10 md:translate-y-20",
        pos === "mid" &&
          "sm:translate-x-10 -translate-x-30  translate-y-20 sm:-translate-y-50  inset-0"
      )}
      alt="Logo"
    />
  );
}
