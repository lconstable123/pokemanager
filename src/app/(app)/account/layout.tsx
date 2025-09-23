"use client";
import React, { useState } from "react";

import LineupBar from "../../../../components/lineup-bar";
import { useIsMobile } from "@/lib/hooks";

import { AddPkModal } from "../../../../components/add-pk-modal";

import { EditPkModal } from "../../../../components/edit-pk-modal";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isMobile, isSmall } = useIsMobile();
  return (
    <>
      <AddPkModal mode="add" />
      <EditPkModal />
      {/* <AddPkModal mode="edit" /> */}
      {isMobile && <LineupBar reorderable={true} isMobile={isMobile} />}
      {children}
      {!isMobile && <LineupBar reorderable={true} isMobile={isMobile} />}
      {/* <WindowBg image="Snorlax" /> */}
    </>
  );
}
