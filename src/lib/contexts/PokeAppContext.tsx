"use client";
import React, { createContext, useContext } from "react";
import { useIsMobile } from "../hooks";

type AppContextType = {
  isMobile: boolean;
  isSmall: boolean;
};

export const PokeAppContext = createContext<AppContextType | null>(null);

export default function PokeAppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isSmall } = useIsMobile(); // default 640px breakpoint

  return (
    <PokeAppContext.Provider value={{ isMobile, isSmall }}>
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
