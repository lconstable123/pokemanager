"use client";
import React, { useEffect, useState, useTransition } from "react";
import { UseDisableScroll } from "./hooks";
import toast from "react-hot-toast";
import { OptimisticAction } from "./contexts/TrainerContext";
import { TLineUp, TPokemon } from "./types";
import { usePokeAppContext } from "./contexts/PokeAppContext";
import { useDexContext } from "./contexts/DexContext";
import { RearrangePokemon } from "./actions";
type TuseBallReorder = {
  setUiLineUp: React.Dispatch<React.SetStateAction<TLineUp>>;
  uiLineUp: TLineUp;
  optimisticLineUp: TLineUp;
  // setOptimisticLineup: (action: OptimisticAction) => void;
};
export default function useBallReorder({
  setUiLineUp,
  uiLineUp,
  optimisticLineUp,
}: // optimisticLineUp,
// setOptimisticLineup,
TuseBallReorder) {
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

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    startRearranging(() => {
      UseDisableScroll(300); // disable scroll for 300ms during animation
      setUiLineUp((prev) => {
        const tempFromTrainer = prev[fromIndex];
        const tempToTrainer = prev[toIndex];
        return prev.map((pokemon, index) => {
          if (index === fromIndex) return tempToTrainer;
          if (index === toIndex) return tempFromTrainer;
          return pokemon;
        });
      });
      // setOptimisticLineup({
      //   action: "rearrange",
      //   payload: { fromIndex, toIndex },
      // });
    });
  };

  // useEffect(() => {
  //   if (!isReordering) {
  //     const RearrangePokemon = async () => {
  //       await RearrangePokemon();
  //     };
  //     RearrangePokemon();
  //     //trigger the setOptimistil lineup to update the lineup in db
  //     toast.success("Rearranged!");
  //   }
  // }, [isReordering]);

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

  // useEffect(() => {
  //   setUiLineUp(optimisticLineUp);
  // }, [optimisticLineUp]);

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
