"use client";
import React from "react";
import Pokeball from "./pokeball";
import { motion } from "framer-motion";
import { del, style } from "framer-motion/client";
import { Variants } from "framer-motion";

export default function Features({
  features,
  initialDelay,
  delayBetweenItems,
}: {
  features: string[];
  initialDelay: number;
  delayBetweenItems: number;
}) {
  const ballVariants: Variants = {
    hidden: { scale: 0, rotate: -45 },
    visible: (custom: number) => ({
      scale: 1,
      rotate: 0,

      transition: {
        delay: initialDelay + custom * delayBetweenItems,
        type: "spring" as const,
        stiffness: 800,
        duration: 0.3,

        damping: 20,
      },
    }),
  };

  const textVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      transition: {
        delay: initialDelay + 0.1 + custom * delayBetweenItems,
        duration: 1,
      },
    }),
  };
  return (
    <ul className="flex gap-5 text-center justify-center mb-7 flex-wrap ">
      {features.map((feature, index) => (
        <li
          key={index}
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-0 group "
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={ballVariants}
            custom={index}
            className="w-4 h-4  "
          >
            <div className="group-hover:scale-145 transition-all duration-200">
              <Pokeball type="09" fill={true} />
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            custom={index}
            className="transition-all duration-200  w-20 ml-1 pointer-events-none"
          >
            <p className="">{feature}</p>
          </motion.div>
        </li>
      ))}
    </ul>
  );
}
