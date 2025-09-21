"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import Pokeball from "./pokeball";
import { motion } from "framer-motion";
import { col } from "framer-motion/client";
export default function SubmitButton({
  ball,
  name,
  onSubmit,
  ballPadding = "150px",
  style = "ball",
  type = "button",
  colorStyle = "default",
  textSize = "base",
  onClick,
}: {
  ball: string;
  name: string;
  onSubmit?: () => void;
  ballPadding?: string;
  style?: "ball" | "noball";
  type?: "button" | "submit" | "reset" | undefined;
  colorStyle?: "default" | "delete" | "submit" | "urgent";
  textSize?: "small" | "base";
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={` transition-transform duration-300 flex flex-row gap-2 items-center h-10 w-[${ballPadding}] group`}
    >
      <Button
        onClick={onClick}
        type={type}
        className={cn(
          " w-30 h-8 transition-all duration-300 active:scale-90",
          style === "ball" ? "group-hover:translate-x-1" : " ",
          colorStyle === "delete" &&
            "bg-red-500 hover:bg-red-600 text-white border-red-200",
          colorStyle === "submit" &&
            "bg-yellow-100 hover:bg-yellow-200 border-yellow-400",
          colorStyle === "urgent" &&
            "bg-red-600 hover:bg-red-500 text-white border-yellow-200",
          colorStyle === "default" &&
            "bg-blue-500 hover:bg-blue-600 text-white border-blue-200"
        )}
      >
        <span
          className={cn("", textSize === "small" ? "text-[8pt]" : "text-base")}
        >
          {name}
        </span>
      </Button>
      {style === "ball" && (
        <div
          className={cn(
            " h-9 w-9 transition-transform duration-300 scale-100",
            style === "ball"
              ? "group-hover:translate-x-4"
              : "group-hover:scale-110  "
          )}
        >
          <Pokeball type={ball} size={30} fill={true} shadow={true} />
        </div>
      )}
    </motion.div>
  );
}
