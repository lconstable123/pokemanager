"use client";
import { TPokemon } from "@/lib/types";
import React, { useEffect, useState } from "react";
import PokeButton from "./back-button";
import Pokeball from "./pokeball";
import { lineUpArray } from "@/lib/data";
import toast from "react-hot-toast";
import clsx from "clsx";
import nav from "./nav";
import { motion, useAnimation } from "framer-motion";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import { line, select } from "framer-motion/client";
import { useScrollStatus } from "@/lib/hooks";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { cn } from "@/lib/utils";
import { is } from "zod/v4/locales";
type TLineupBar = {
  reorderable: boolean;
  isMobile: boolean;
};
export default function LineupBar({ reorderable, isMobile }: TLineupBar) {
  const {
    lineUp,
    slots,
    ballEdit,
    ballShiftMode,
    isReordering,
    handleToggleReorder,
    handleBallClick,
    uiLineup,
    ballLayoutEnabled,
    isTransitionUi,
  } = useTrainerContext();
  const controls = useAnimation();

  const handleBallBounce = () => {
    slots.forEach((_, index) => {
      controls.start((custom) => {
        if (custom === index) {
          return {
            y: [0, -9, 0],
            transition: {
              duration: 0.3,
              ease: "easeInOut",
              delay: index * 0.07,
            },
          };
        }
        return {};
      });
    });
  };

  useEffect(() => {
    if (isReordering) {
      handleBallBounce();
    }
  }, [isReordering]);

  return (
    <nav className="  z-30 pt-6 pb-5  fixed sm:absolute w-full bottom-10 sm:bottom-0  flex flex-col-reverse sm:flex-row gap-2 sm:gap-5 items-center justify-center ">
      {isMobile && (
        // add background bubble for mobile
        <div className="mx-5 rounded-full absolute inset-0 bg-gray-50 border-2 border-black text-sm hardShadow" />
      )}
      {reorderable && (
        <PokeButton
          disabled={false}
          text="Reorder"
          type="action"
          onClick={handleToggleReorder}
          modeActive={isReordering}
        />
      )}
      <LineupComponent>
        {slots.map((lineupBall, index) => {
          return (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 }}
              key={lineupBall.id}
              className={clsx(" w-7 h-7 mx-0", {})}
            >
              {!lineupBall.empty ? (
                <motion.div
                  layout
                  layoutScroll
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  key={uiLineup[index]?.id || lineupBall.id}
                  custom={index}
                  animate={controls}
                  onClick={() => handleBallClick?.(index)}
                  className={clsx("relative ", {
                    "-translate-y-2": ballEdit === index,
                  })}
                >
                  <div
                    className={clsx(
                      "duration-500 delay-0 transition-all absolute -top-3 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full ",
                      isReordering && ballEdit !== index
                        ? "opacity-100 bg-yellow-300"
                        : isReordering
                        ? "bg-green-400"
                        : "opacity-0"
                    )}
                  />

                  <Pokeball type={"01"} fill={true} hoverAnim={true} />
                </motion.div>
              ) : (
                <AddBall isReordering={isReordering} />
              )}
            </motion.div>
          );
        })}
      </LineupComponent>
    </nav>
  );
}

// ball nav
function LineupComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex justify-center items-center h-11">
      <div
        className={clsx(
          "absolute top-1 left-3 gap-3 flex justify-center items-start h-full",
          {}
        )}
      >
        {children}
      </div>
      <LineUpArrow />
    </div>
  );
}

function LineUpArrow() {
  return (
    <img
      src={"/arrow.svg"}
      alt="arrow"
      className="h-full z-3 user-select-none pixelImage pointer-events-none"
    />
  );
}

//empty ball slot
function AddBall({ isReordering }: { isReordering: boolean }) {
  const { setAddPkModalOpen } = usePokeAppContext();
  return (
    <div
      onClick={() => setAddPkModalOpen(true)}
      className={cn(
        " bg-gray-400 hover:bg-yellow-200 transition-all",
        "duration-600 flex items-center justify-center rounded-full",
        !isReordering
          ? "cursor-pointer opacity-100"
          : "pointer-events-none opacity-60"
      )}
    >
      <span className=" text-lg text-center font-bold text-white">+</span>
    </div>
  );
}
