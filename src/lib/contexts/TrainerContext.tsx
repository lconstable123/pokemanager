"use client";
import React, { createContext, useContext, useState } from "react";
import { TLineUp, TTrainer } from "../types";
import toast from "react-hot-toast";
type TrainerContextType = {
  trainer: TTrainer;
  lineUp: TLineUp;
  slots: string[];
  ballEdit: number | null;
  ballShiftMode: "select" | "shift";
  isReordering: boolean;
  handleReorder: (fromIndex: number, toIndex: number) => void;
  handleBallClick?: (selectedBallIndex?: number) => void;
  handleToggleReorder?: () => void;
};
import { initialTrainerData } from "../data";
export const TrainerContext = createContext<TrainerContextType | null>(null);

export default function TrainerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lineUp, setLineUp] = useState(initialTrainerData.lineup.slice(0, 5));

  const slots = Array.from({ length: 6 }, (_, i) =>
    lineUp[i] ? lineUp[i].id : "empty" + (i + 1)
  );

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setLineUp((prev) => {
      const tempFromTrainer = lineUp[fromIndex];
      const tempToTrainer = lineUp[toIndex];
      return prev.map((pokemon, index) => {
        if (index === fromIndex) return tempToTrainer;
        if (index === toIndex) return tempFromTrainer;
        return pokemon;
      });
    });
  };

  const [ballEdit, setBallEdit] = useState<number | null>(null);
  const [ballShiftMode, setBallShiftMode] = useState<"select" | "shift">(
    "select"
  );
  const [isReordering, setReordering] = useState(false);
  const handleToggleReorder = () => {
    setReordering((prev) => {
      if (prev) {
        resetShifting();
      }
      return !prev;
    });
  };
  const resetShifting = () => {
    setBallEdit(null);
    setBallShiftMode("select");
  };

  const handleBallClick = (selectedBallIndex?: number) => {
    //reorder mode toggled
    if (isReordering && selectedBallIndex !== undefined) {
      if (lineUp[selectedBallIndex] === undefined) {
        toast.error("Cannot shift with empty ball");
        return;
      }
      if (ballShiftMode === "select") {
        setBallEdit(selectedBallIndex);
        setBallShiftMode("shift");
      } else if (ballEdit !== null) {
        handleReorder(ballEdit, selectedBallIndex);
        resetShifting();
      }
    } else {
      toast.success("navigating inside ball");
    }
  };

  return (
    <TrainerContext.Provider
      value={{
        trainer: initialTrainerData,
        lineUp,
        handleReorder,
        slots,
        ballEdit,
        ballShiftMode,
        isReordering,
        handleToggleReorder,
        handleBallClick,
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
}

export function useTrainerContext() {
  const context = useContext(TrainerContext);
  if (!context)
    throw new Error(
      "useTrainerContext must be used within TrainerContextProvider"
    );
  return context;
}
