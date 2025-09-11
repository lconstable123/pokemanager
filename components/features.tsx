"use client";
import React from "react";
import Pokeball from "./pokeball";
import { motion } from "framer-motion";
import { del, style } from "framer-motion/client";
import { Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { platform } from "os";

const techStack = [
  "Next.JS",
  "Typescript",
  "React",
  "TailwindCSS",
  "Framer Motion",
  "Next-Auth",
  "Prisma",
  "PostGres",
  "Vercel",
  "UseOptimistic",
  "RadixUI",
  "ShadCN",
  "React-Icons",
  "Figma",
  "PokeApi",
  "React-hot-toast",
  "React-Form",
  "React-Context",
  "Git",
];

const Attributions = [
  { name: "Hy-oppa", platform: "DeviantArt" },
  { name: "LuqiPower", platform: "DeviantArt" },
  { name: "Korapol", platform: "Patreon" },
];

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
    <FeaturesBar>
      {features.map((feature, index) => (
        <li
          key={index}
          className="flex flex-col sm:flex-row items-center gap-x-1 gap-y-3 sm:gap-0 group "
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={ballVariants}
            custom={index}
            className="w-5 h-5 sm:w-4 sm:h-4  "
          >
            <div className=" group-hover:scale-145 transition-all duration-200">
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
            <p className="noSelect primary-p-styling">{feature}</p>
          </motion.div>
        </li>
      ))}
    </FeaturesBar>
  );
}
//----------------------------//

function FeaturesBar({ children }: { children: React.ReactNode }) {
  return (
    <section className=" mb-7 sm:mb-5 flex flex-col gap-0 items-center justify-start">
      <ul className="flex gap-1 sm:gap-5 text-center justify-center mb-4 sm:mb-2 flex-wrap ">
        {children}
      </ul>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 + 0.1 * 6, duration: 1 }}
      >
        <MoreDetails />
      </motion.div>
    </section>
  );
}

function MoreDetails() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="transition-all scale:100 w-32 hover:scale-110 h-4 text-[9pt]"
        >
          More details
        </Button>
      </DialogTrigger>
      <DialogContent tabIndex={-1} className="gap-y-2! noSelect pb-9">
        <DialogHeader></DialogHeader>
        <DialogTitle className=" flex items-center gap-3 text-[15pt]! Text-primary! font-semibold!">
          <div className="h-4 w-4">
            <Pokeball type="05" fill={true} />
          </div>
          Stack
        </DialogTitle>
        <DialogDescription className="text-[9pt]! pt-2 pb-2">
          I have used GPT and GitHub Copilot for reference, bugfixes, and
          boilerplate. <br />
          <br />
          <b>However</b>, all core functionality is designed and implemented by
          me. These tools supported the process but did not replace my own
          development.
        </DialogDescription>
        <DialogDescription asChild>
          {
            <ul className="pb-4 flex flex-row flex-wrap gap-y-0 gap-x-3 text-[8pt]">
              {techStack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          }
        </DialogDescription>
        <DialogTitle className=" flex items-center gap-3 text-[15pt]! Text-primary! font-semibold!">
          <div className="h-4 w-4">
            <Pokeball type="03" fill={true} />
          </div>
          Asset attributions
        </DialogTitle>
        <DialogDescription asChild>
          {
            <ul className="pt-2 pb-2 flex flex-row flex-wrap gap-y-0 gap-x-5 text-[8pt]">
              {Attributions.map((attr) => (
                <li key={attr.name}>
                  <div className="flex flex-col  leading-none">
                    <div className="h-4 text-gray-800! ">{attr.name}</div>
                    <div className="  leading-none">{attr.platform}</div>
                  </div>
                </li>
              ))}
            </ul>
          }
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
