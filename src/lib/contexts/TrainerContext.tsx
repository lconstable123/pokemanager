"use client";
import React, { createContext, useContext } from "react";
import { TLineUp, TTrainer } from "../types";

type TrainerContextType = {
  trainer: TTrainer;
  lineUp: TLineUp;
};
import { initialTrainerData } from "../data";
export const TrainerContext = createContext<TrainerContextType | null>(null);

export default function TrainerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrainerContext.Provider
      value={{ trainer: initialTrainerData, lineUp: initialTrainerData.lineup }}
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
