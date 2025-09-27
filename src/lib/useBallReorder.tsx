"use client";
import React, { useEffect, useState, useTransition } from "react";
import { UseDisableScroll } from "./hooks";
import toast from "react-hot-toast";
import { OptimisticAction } from "./contexts/TrainerContext";
import { TLineUp, TPokemon } from "./types";
import { usePokeAppContext } from "./contexts/PokeAppContext";
import { useDexContext } from "./contexts/DexContext";
import { RearrangePokemon } from "./actions";
import { sleep } from "./utils";
import { is } from "zod/v4/locales";
type TuseBallReorder = {
  setLineupRearrange: React.Dispatch<React.SetStateAction<TLineUp>>;
  lineupRearrange: TLineUp;
  optimisticLineUp: TLineUp;
  setOptimisticLineup: (action: OptimisticAction) => void;
  badServer?: boolean;
};
export default function useBallReorder({
  setLineupRearrange,
  lineupRearrange,
  optimisticLineUp,
  setOptimisticLineup,
  badServer,
}: TuseBallReorder) {
  //---------------------------------------------------------------derived states

  const { handleSelectPk, setEvolutions } = usePokeAppContext();
  const { handleFetchEvolution } = useDexContext();

  //---------------------------------------------------------------states

  const [isReordering, setReordering] = useState(false);
  const [ballLayoutEnabled] = useState(true);
  const [ballEdit, setBallEdit] = useState<number | null>(null);
  const [ballShiftMode, setBallShiftMode] = useState<"select" | "shift">(
    "select"
  );
  //--------------------------------------------------------------handlers
  const [isRearranging, startRearranging] = useTransition();
  const [uiEdit, setuiEdit] = useState(false);
  //set the ui LineUp to either the optimisticLineUp or the Temporay rearanging Mode
  //if we're in reordering mode, or not, but still reararrange, show rearranging ui, otherwise the optimistic
  const uiLineup = uiEdit ? lineupRearrange : optimisticLineUp;

  const handleReorderConfirmation = async () => {
    startRearranging(() => {
      setOptimisticLineup({ action: "commit", payload: lineupRearrange });
    });
    // toast.success(!badServer ? "good data" : "bad-data-insertion-test");

    const error = await RearrangePokemon(
      !badServer ? lineupRearrange : "bad-data-insertion-test"
    );
    if (error) {
      toast.error("Error rearranging: " + error);
      setLineupRearrange(optimisticLineUp);
    } else {
      toast.success("Rearranged on server!");
    }
    setuiEdit(false);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    setuiEdit(true);
    UseDisableScroll(300); // disable scroll for 300ms during animation
    setLineupRearrange((prev) => {
      const tempFromTrainer = prev[fromIndex];
      const tempToTrainer = prev[toIndex];
      return prev.map((pokemon, index) => {
        if (index === fromIndex) return tempToTrainer;
        if (index === toIndex) return tempFromTrainer;
        return pokemon;
      });
    });
  };

  const handleToggleReorder = () => {
    setReordering((prev) => {
      if (prev) {
        setTimeout(() => {
          handleReorderConfirmation();
        }, 0);
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

  return {
    ballEdit,
    handleReorder,
    ballShiftMode,
    isReordering,
    handleToggleReorder,
    handleBallClick,
    ballLayoutEnabled,
    uiLineup,
  };
}
