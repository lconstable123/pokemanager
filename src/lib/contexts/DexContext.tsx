"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

import { UseFetchPk } from "../useFetchPk";
import toast from "react-hot-toast";

type DexContextType = {
  PkDropdownPage: number;
  handlePkPageNext: () => void;
  handlePkPagePrev: () => void;
  generationFilter: string[];
  handleSetGenrationFilter: (gens: string[]) => void;
  typeFilter: string[];
  setTypeFilter: React.Dispatch<React.SetStateAction<string[]>>;
  maxPkDropdownPages: number;
  PkDropdownEntries: string[];
  setPkDropdownEntries: React.Dispatch<React.SetStateAction<string[]>>;
  PkDropdownAmt: number;
  dexloading: boolean;
  selectedDexPk: string | null;
  setSelectedDexPk: React.Dispatch<React.SetStateAction<string | null>>;
  P: any;
};

export const DexContext = createContext<DexContextType | null>(null);

export default function DexContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const Pokedex = require("pokeapi-js-wrapper");
  const P = new Pokedex.Pokedex();
  const [selectedDexPk, setSelectedDexPk] = useState<string | null>(null);

  const {
    handlePkPageNext,
    handlePkPagePrev,
    PkDropdownPage,
    maxPkDropdownPages,
    PkDropdownEntries,
    setPkDropdownEntries,
    PkDropdownAmt,
    generationFilter,
    handleSetGenrationFilter,
    typeFilter,
    setTypeFilter,
    dexloading,
  } = UseFetchPk(P);

  // useEffect(() => {
  //   toast.success("debugselectedDexPk: " + selectedDexPk);
  // }, [selectedDexPk]);

  return (
    <DexContext.Provider
      value={{
        handlePkPageNext,
        handlePkPagePrev,
        PkDropdownPage,
        maxPkDropdownPages,
        PkDropdownEntries,
        setPkDropdownEntries,
        PkDropdownAmt,
        generationFilter,
        handleSetGenrationFilter,
        typeFilter,
        setTypeFilter,
        dexloading,
        selectedDexPk,
        setSelectedDexPk,
        P,
      }}
    >
      {children}
    </DexContext.Provider>
  );
}

export function useDexContext() {
  const context = useContext(DexContext);
  if (!context)
    throw new Error("useAppContext must be used within AppContextProvider");
  return context;
}
