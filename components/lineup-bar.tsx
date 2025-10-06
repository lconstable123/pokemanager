"use client";

import React, { useEffect } from "react";
import PokeButton from "./back-button";
import Pokeball from "./pokeball";

import clsx from "clsx";

import { motion, useAnimation } from "framer-motion";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { cn } from "@/lib/utils";

type TLineupBar = {
  reorderable: boolean;
  isMobile: boolean;
};
export default function LineupBar({ reorderable, isMobile }: TLineupBar) {
  const {
    slots,
    ballEdit,
    isReordering,
    handleToggleReorder,
    handleBallClick,
    uiLineup,
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
    <nav className="z-700 pt-6 sm:pt-6 h-30 sm:h-27 pb-5 fixed sm:absolute w-full bottom-0 sm:bottom-0  flex flex-col-reverse sm:flex-row gap-2 sm:gap-5 items-center justify-end sm:justify-center ">
      {isMobile && (
        // add background bubble for mobile
        <div className=" absolute  inset-0 bg-gray-50 border-t-2  border-black text-sm hardShadow" />
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

                  <Pokeball
                    type={uiLineup[index].ball}
                    fill={true}
                    hoverAnim={true}
                  />
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
      <span className="noSelect text-lg text-center font-bold text-white">
        +
      </span>
    </div>
  );
}
