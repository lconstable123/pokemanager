"use client";
import React, { useState, useTransition } from "react";
import { UseDisableScroll } from "./hooks";
import toast from "react-hot-toast";
import { OptimisticAction } from "./contexts/TrainerContext";
import { TLineUp, TPokemon } from "./types";
import { usePokeAppContext } from "./contexts/PokeAppContext";
import { useDexContext } from "./contexts/DexContext";
type TuseBallReorder = {
  setOptimisticLineup: (action: OptimisticAction) => void;
  optimisticLineUp: TPokemon[];
  setServerLineUp: React.Dispatch<React.SetStateAction<TLineUp>>;
};
export default function useBallReorder({
  setOptimisticLineup,
  setServerLineUp,
  optimisticLineUp,
}: TuseBallReorder) {
  //---------------------------------------------------------------derived states

  const { handleSelectPk, setEvolutions } = usePokeAppContext();
  const { handleFetchEvolution } = useDexContext();

  //---------------------------------------------------------------states

  const [isReordering, setReordering] = useState(false);
  const [ballLayoutEnabled] = useState(true);
  const [isRearranging, startRearranging] = useTransition();
  const [ballEdit, setBallEdit] = useState<number | null>(null);
  const [ballShiftMode, setBallShiftMode] = useState<"select" | "shift">(
    "select"
  );
  //--------------------------------------------------------------handlers

  const handleReorder = (fromIndex: number, toIndex: number) => {
    startRearranging(() => {
      UseDisableScroll(300); // disable scroll for 300ms during animation
      setOptimisticLineup({
        action: "rearrange",
        payload: { fromIndex, toIndex },
      });
      setServerLineUp((prev) => {
        const tempFromTrainer = prev[fromIndex];
        const tempToTrainer = prev[toIndex];
        return prev.map((pokemon, index) => {
          if (index === fromIndex) return tempToTrainer;
          if (index === toIndex) return tempFromTrainer;
          return pokemon;
        });
      });
    });
  };

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

  const handleBallClick = async (selectedBallIndex?: number) => {
    //reorder mode toggled
    if (isReordering && selectedBallIndex !== undefined) {
      if (optimisticLineUp[selectedBallIndex] === undefined) {
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
      const selectedPk = optimisticLineUp[selectedBallIndex ?? 0] || null;
      handleSelectPk(selectedPk);
      // toast.success("Selected Pokémon: " + selectedPk?.species);
      if (selectedPk) {
        // toast.success("Fetching evolution for: " + selectedPk.species);
        const evolutions = await handleFetchEvolution(selectedPk.species);
        setEvolutions(evolutions);
      }
    }
  };

  // const handleDisableBallLayout = (time: number) => {
  //   setBallLayoutEnabled(false);
  //   setTimeout(() => {
  //     toast.success("disabling layout");
  //     toast.success("enabling layout");
  //     setBallLayoutEnabled(true);
  //   }, time);
  // };

  return {
    ballEdit,
    handleReorder,
    ballShiftMode,
    isReordering,
    handleToggleReorder,
    handleBallClick,
    ballLayoutEnabled,
  };
}
