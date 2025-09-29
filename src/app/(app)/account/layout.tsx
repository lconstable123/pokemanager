"use client";
import React, { useState } from "react";

import LineupBar from "../../../../components/lineup-bar";
import { useIsMobile } from "@/lib/hooks";

import { AddPkModal } from "../../../../components/add-pk-modal";

import { EditPkModal } from "../../../../components/edit-pk-modal";
import WindowBg from "../../../../components/window-bg/window-bg";
import NavBar from "../../../../components/nav-bar";
import TrainerContextProvider from "@/lib/contexts/TrainerContext";
import DexContextProvider from "@/lib/contexts/DexContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isMobile, isSmall } = useIsMobile();
  return (
    <>
      <AddPkModal mode="add" />
      <EditPkModal />

      <WindowBg image="Charizard" pos="mid" />
      {isMobile && <LineupBar reorderable={true} isMobile={isMobile} />}
      {children}
      {!isMobile && <LineupBar reorderable={true} isMobile={isMobile} />}
    </>
  );
}
