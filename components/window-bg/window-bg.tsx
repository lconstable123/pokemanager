"use client";
import { motion } from "framer-motion";
import React from "react";

type WindowBgProps = {
  image: "Snorlax" | "Charizard" | "Pikachu";
};

export default function WindowBg({ image }: WindowBgProps) {
  const getImageSrc = (image: "Snorlax" | "Charizard" | "Pikachu") => {
    switch (image) {
      case "Snorlax":
        return "/08 - Snorlax.svg";
      case "Charizard":
        return "/06 - Charizard.svg";
      case "Pikachu":
        return "/01 - Pikachu.svg";
    }
  };

  return (
    <motion.img
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.025 }}
      transition={{ duration: 1, ease: "easeOut" }}
      src={getImageSrc(image)}
      width={6000}
      height={300}
      className="z-1 absolute sm:-translate-x-50 -translate-x-10 md:translate-y-20  scale-[150%] md:scale-100 pointer-events-none"
      alt="Logo"
    />
  );
}
