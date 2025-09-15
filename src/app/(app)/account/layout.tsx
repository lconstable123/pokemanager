"use client";
import React, { useState } from "react";

const OPTIONS = ["Fire", "Water", "Grass", "Electric", "Rock", "Psychic"];
import * as Popover from "@radix-ui/react-popover";
import Canvas from "../../../../components/canvas";
import MainWindow from "../../../../components/main-window";
import WindowBg from "../../../../components/window-bg/window-bg";
import BackButton from "../../../../components/back-button";
import TrainerContextProvider, {
  useTrainerContext,
} from "@/lib/contexts/TrainerContext";
import NavBar from "../../../../components/nav-bar";
import LineupBar from "../../../../components/lineup-bar";
import { useIsMobile } from "@/lib/hooks";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import SubmitButton from "../../../../components/submit-button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import FormErrorMessage from "../../../../components/form-error-message";
import { AddPkModal } from "../../../../components/add-pk-modal";
import { Edit } from "lucide-react";
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
