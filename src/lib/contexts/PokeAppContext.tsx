"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIsMobile } from "../hooks";
import toast from "react-hot-toast";
import { ApiPkData, TPokemon } from "../types";

import { RomanToInt } from "../utils";
import { UseFetchPk } from "../useFetchPk";
import { i, s } from "framer-motion/client";
import { FetchPkDetails } from "../pokeApi-actions";

type AppContextType = {
  isMobile: boolean;
  isSmall: boolean;
  disableScroll: (time?: number) => void;
  AddPkModalopen: boolean;
  setAddPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  EditPkModalopen: boolean;
  setEditPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPk: TPokemon | null;
  setSelectedPk: React.Dispatch<React.SetStateAction<TPokemon | null>>;
  handleSelectPk: (pokemon: TPokemon) => void;
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

export const PokeAppContext = createContext<AppContextType | null>(null);

export default function PokeAppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const Pokedex = require("pokeapi-js-wrapper");
  const P = new Pokedex.Pokedex();
  const { isMobile, isSmall } = useIsMobile(); // default 640px breakpoint
  const [AddPkModalopen, setAddPkModalOpen] = useState(false);
  const [EditPkModalopen, setEditPkModalOpen] = useState(false);
  const [selectedPk, setSelectedPk] = useState<TPokemon | null>(null);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedDexPk, setSelectedDexPk] = useState<string | null>(null);
  // const [DexPrevImg, setSelectedDexPrevImg] = useState<string | null>(null);
  //Fetching of Pokédex entries for dropdown
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

  //Selection of Pokémon from list
  const handleSelectPk = (pokemon: TPokemon) => {
    if (selectedPk && EditPkModalopen) {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
      toast.error("modeal is already open.");
      setAddPkModalOpen(false);
      setSelectedPk(pokemon);
      modalTimerRef.current = setTimeout(() => {
        setAddPkModalOpen(true);
        toast.success("Switched to new Pokémon.");
      }, 1000);
      return;
    } else if (pokemon) {
      setSelectedPk(pokemon);
      setEditPkModalOpen(true);
    }
  };

  const disableScroll = (time = 500) => {
    const scrollContainer = (document.scrollingElement ||
      document.documentElement) as HTMLElement;

    // Temporarily disable smooth scrolling to prevent auto-scroll during animation

    scrollContainer.style.scrollBehavior = "auto";
    scrollContainer.style.overflow = "hidden";

    // Optionally restore it after animation (e.g. after 500ms)
    setTimeout(() => {
      scrollContainer.style.overflow = "auto";
      scrollContainer.style.scrollBehavior = "smooth";
    }, time);
  };

  return (
    <PokeAppContext.Provider
      value={{
        isMobile,
        isSmall,
        disableScroll,
        AddPkModalopen,
        setAddPkModalOpen,
        EditPkModalopen,
        setEditPkModalOpen,
        selectedPk,
        setSelectedPk,
        handleSelectPk,
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
    </PokeAppContext.Provider>
  );
}

export function usePokeAppContext() {
  const context = useContext(PokeAppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppContextProvider");
  return context;
}
