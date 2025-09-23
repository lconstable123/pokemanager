"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { UseDisableScroll, useIsMobile } from "../hooks";
import toast from "react-hot-toast";
import { ApiPkData, TPokemon } from "../types";

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
  evolutions: string[];
  selectedFormTrainer: number;
  setSelectedFormTrainer: React.Dispatch<React.SetStateAction<number>>;
  setEvolutions: React.Dispatch<React.SetStateAction<string[]>>;
  isInspectingLineup: boolean;
  setIsInspectingLineup: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [isLoadingEvolutions, setIsLoadingEvolutions] = useState(false);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isInspectingLineup, setIsInspectingLineup] = useState(true);
  const [selectedFormTrainer, setSelectedFormTrainer] = useState(0);
  // const { handleFetchEvolution } = useDexContext();
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
      // toast.success("Selected Pokémon: " + pokemon.name);
      setEditPkModalOpen(true);
    }
  };

  useEffect(() => {
    if (AddPkModalopen) {
      setIsInspectingLineup(false);
    }
    if (EditPkModalopen) {
      setIsInspectingLineup(true);
    }
  }, [AddPkModalopen, EditPkModalopen]);

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
        evolutions,
        setEvolutions,
        selectedFormTrainer,
        setSelectedFormTrainer,
        isInspectingLineup,
        setIsInspectingLineup,
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
