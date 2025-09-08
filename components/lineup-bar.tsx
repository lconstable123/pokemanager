"use client";
import { TPokemon } from "@/lib/types";
import React, { useState } from "react";
import PokeButton from "./back-button";
import Pokeball from "./pokeball";
import { lineUpArray } from "@/lib/data";
import toast from "react-hot-toast";
import clsx from "clsx";
import nav from "./nav";
import { motion } from "framer-motion";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import { select } from "framer-motion/client";
type TLineupBar = {
  reorderable: boolean;
};
export default function LineupBar({ reorderable }: TLineupBar) {
  const {
    lineUp,
    slots,
    ballEdit,
    ballShiftMode,
    isReordering,
    handleToggleReorder,
    handleBallClick,
  } = useTrainerContext();

  return (
    <nav className="border-1 absolute w-full bottom-5 h-[45px] flex flex-row gap-5 items-center justify-center ">
      <p className="absolute left-1 text-sm">
        is reordering: {isReordering ? "true" : "false"} balledit:{" "}
        {ballEdit !== null ? ballEdit : "null"} shiftMode:
        {ballShiftMode}
      </p>
      {reorderable && (
        <PokeButton
          text="Reorder"
          type="action"
          onClick={handleToggleReorder}
          modeActive={isReordering}
        />
      )}
      <LineupComponent>
        {slots.map((lineupBall, index) => {
          return (
            <div
              key={lineupBall}
              className={clsx("transition-all duration-300 w-7 h-7 mx-0", {})}
            >
              {lineUp[index] ? (
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  key={lineupBall}
                  onClick={() => handleBallClick?.(index)}
                  className={clsx("relative", {
                    "-translate-y-2": ballEdit === index,
                  })}
                >
                  <div
                    className={clsx(
                      "duration-700 delay-100 transition-all absolute -top-3 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-gray-300",
                      ballShiftMode === "shift" && ballEdit !== index
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  <Pokeball type={lineUp[index].ball} fill={true} />
                </motion.div>
              ) : (
                <AddBall />
              )}
            </div>
          );
        })}
      </LineupComponent>
    </nav>
  );
}

// ball nav
function LineupComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex justify-center items-center h-full">
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
function AddBall() {
  return (
    <div className="bg-gray-400  flex items-center justify-center rounded-full">
      <span className="noSelect text-lg text-center font-bold text-white">
        +
      </span>
    </div>
  );
}
