"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
type Tpokebutton = {
  text?: string;
  link?: string;
  type?: "nav" | "action";
  modeActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export default function PokeButton({
  text = "back",
  link = "/",
  type = "nav",
  onClick = () => {},
  modeActive = false,
  disabled = false,
}: Tpokebutton) {
  const { handlePageTransition } = usePokeAppContext();

  if (type === "nav") {
    return (
      // <Link href={link} tabIndex={-1} className=" z-4 focus:outline-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, x: 0 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        whileHover={{ x: -5, transition: { delay: 0 } }} // no delay, instant
        whileTap={{ scale: 0.9, x: -5, transition: { delay: 0 } }} // instant tap
        transition={{
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        className=" z-4 focus:outline-none"
      >
        <Button
          onClick={() => handlePageTransition(link, 0.15)}
          className={cn("  cursor-pointer w-25 h-7  ", {
            "opacity-50  pointer-events-none": disabled,
          })}
        >
          {text}
        </Button>
      </motion.div>
      // </Link>
    );
  }
  if (type === "action") {
    return (
      <Button
        onClick={onClick}
        className={cn(
          "transition-all z-4 focus:outline-none cursor-pointer w-25 h-7  duration-300  hover:scale-105",
          {
            "bg-yellow-100 border-yellow-300 text-yellow-900 scale-105":
              modeActive === true,
            "opacity-70  pointer-events-none": disabled,
          }
        )}
      >
        <span className="noSelect">{text}</span>
      </Button>
    );
  }
}
