"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { UseDisableScroll, useIsMobile } from "../hooks";
import toast from "react-hot-toast";
import { ApiPkData, TPokemon } from "../types";

import { UseFetchPk } from "../useFetchPk";

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
};

export const PokeAppContext = createContext<AppContextType | null>(null);

export default function PokeAppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isSmall } = useIsMobile(); // default 640px breakpoint
  const [AddPkModalopen, setAddPkModalOpen] = useState(false);
  const [EditPkModalopen, setEditPkModalOpen] = useState(false);
  const [selectedPk, setSelectedPk] = useState<TPokemon | null>(null);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  //------------------------------------------------Selection of Pokémon from list
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

  const disableScroll = UseDisableScroll;

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
