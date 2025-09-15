"use client";
import React, { createContext, useContext, useState } from "react";
import { useIsMobile } from "../hooks";
import toast from "react-hot-toast";
import { TPokemon } from "../types";

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
