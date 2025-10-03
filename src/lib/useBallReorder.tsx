"use client";
import React, { useState, useTransition } from "react";
import { UseDisableScroll } from "./hooks";
import toast from "react-hot-toast";

import { OptimisticAction, TLineUp, TPokemon } from "./types";
import { usePokeAppContext } from "./contexts/PokeAppContext";
import { useDexContext } from "./contexts/DexContext";
import { RearrangePokemon } from "./actions";

type TuseBallReorder = {
  setLineupRearrange: React.Dispatch<React.SetStateAction<TLineUp>>;
  lineupRearrange: TLineUp;
  optimisticLineUp: TLineUp;
  setOptimisticLineup: (action: OptimisticAction) => void;
};
export default function useBallReorder({
  setLineupRearrange,
  lineupRearrange,
  optimisticLineUp,
  setOptimisticLineup,
}: TuseBallReorder) {
  //---------------------------------------------------------------derived states

  const {
    handleSelectPk,
    setEvolutions,
    badServer,
    handleServerError,
    startRearranging,
  } = usePokeAppContext();
  const { handleFetchEvolution } = useDexContext();

  //---------------------------------------------------------------states

  const [isReordering, setReordering] = useState(false);
  const [ballLayoutEnabled] = useState(true);
  const [ballEdit, setBallEdit] = useState<number | null>(null);
  const [ballShiftMode, setBallShiftMode] = useState<"select" | "shift">(
    "select"
  );
  // const [isRearranging, startRearranging] = useTransition();
  const [uiEdit, setuiEdit] = useState(false);
  const uiLineup = uiEdit ? lineupRearrange : optimisticLineUp;
  //--------------------------------------------------------------handlers

  //on first toggle of reorder button, sync ui with optimistic
  const handleInitialRearrangingUiSync = () => {
    setLineupRearrange(optimisticLineUp);
  };

  //on end toggle of reorder button, confirm and send to server
  const handleReorderConfirmation = async () => {
    startRearranging(() => {
      setOptimisticLineup({ action: "commit", payload: lineupRearrange });
    });

    const error = await RearrangePokemon(
      !badServer ? lineupRearrange : "bad-data-insertion-test"
    );
    if (error) {
      // toast.error("Error rearranging on server");
      handleServerError();
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

  //on press of button, toggle reorder mode
  const handleToggleReorder = () => {
    if (isReordering) {
      resetShifting();
      setTimeout(() => {
        // toast.success("Reorder mode off, saving changes...");
        handleReorderConfirmation();
      }, 0);
    } else {
      handleInitialRearrangingUiSync();
    }
    setReordering(!isReordering);
  };

  const resetShifting = () => {
    setBallEdit(null);
    setBallShiftMode("select");
  };

  // ball / pokemon interaction handler, sometimes rearrange, sometimes enter modal
  const handleBallClick = async (selectedBallIndex?: number) => {
    //reorder mode toggled
    if (isReordering && selectedBallIndex !== undefined) {
      if (optimisticLineUp[selectedBallIndex] === undefined) {
        // toast.error("Cannot shift with empty ball");
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
      if (selectedPk) {
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
