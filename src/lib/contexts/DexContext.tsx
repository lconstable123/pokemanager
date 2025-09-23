"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

import { UseFetchPk } from "../useFetchPk";
import { set } from "zod";

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
  handleFetchEvolution: (pkname: string) => Promise<string[]>;
  isLoadingEvolutions: boolean;
  setIsLoadingEvolutions: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isLoadingEvolutions, setIsLoadingEvolutions] = useState(false);
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

  async function handleFetchEvolution(pokemonName: string) {
    try {
      setIsLoadingEvolutions(true);
      // Step 1: Get Pokémon species data
      const species = await P.getPokemonSpeciesByName(
        pokemonName?.toLowerCase()
      );

      // if (!species.ok) {
      //   console.log("No species data found for:", pokemonName);
      //   return [];
      // }
      console.log("Fetching evolution for:", species);
      const evoChainUrl = species?.evolution_chain.url;
      console.log("Evolution Chain URL:", evoChainUrl);
      // Step 2: Fetch the actual evolution chain data
      const response = await fetch(evoChainUrl);
      if (!response.ok) {
        // throw new Error("Failed to fetch evolution chain data");
      }
      const evolutionData = await response.json();
      console.log("Evolution Chain Data:", evolutionData);
      let evoList = [];
      const TPK = evolutionData?.chain.species?.name;

      evoList.push(evolutionData.chain.species.name);

      const evolvesTo = evolutionData?.chain?.evolves_to;
      console.log("Evolves To Array:", evolvesTo);
      if (evolvesTo.length === 0) {
        console.log("This Pokémon does not evolve.");
        setIsLoadingEvolutions(false);
        return [];
      } else {
        console.log("This Pokémon evolves.");
      }
      for (const mutation of evolvesTo) {
        console.log("adding ", mutation?.species?.name);

        evoList.push(mutation?.species?.name);

        if (mutation.evolves_to.length > 0) {
          for (const subMutation of mutation.evolves_to) {
            evoList.push(subMutation?.species?.name);
          }
        }
      }
      console.log("Evolves To:", evoList);
      setIsLoadingEvolutions(false);
      return evoList;
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
      return [];
    }
  }

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
        handleFetchEvolution,
        isLoadingEvolutions,
        setIsLoadingEvolutions,
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
