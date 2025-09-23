"use client";
import React, { useState } from "react";
import BackButton from "./back-button";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import { getTrainerSprite } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Pokeball from "./pokeball";

import toast from "react-hot-toast";
import SubmitButton from "./submit-button";

type TNavBar = {
  isBackEnabled?: boolean;
  isProfileEnabled?: boolean;
  Navlink?: string;
};

export default function NavBar({
  isBackEnabled = true,
  isProfileEnabled = false,
  Navlink = "/",
}: TNavBar) {
  const { trainer } = useTrainerContext();
  return (
    <nav className=" flex pt-2 pl-4 pr-3 items-center justify-between w-full  z-4">
      {isBackEnabled && <BackButton />}

      {isProfileEnabled && (
        <div className="flex items-center gap-3">
          <h3 className="text-[10pt]  italic font-light">
            Welcome back, {trainer.name}.
          </h3>
          <TrainerModal />
        </div>
      )}
    </nav>
  );
}

function ProfileButton({
  handleClick,
  sprite,
}: {
  handleClick: () => void;
  sprite: string;
}) {
  return (
    <div
      onClick={() => {
        handleClick();
      }}
      className="hover:scale-110 scale-100 transition-all border-0 border-gray-700 relative overflow-hidden w-11 h-11 rounded-full bg-red-300"
    >
      <img
        src={sprite}
        alt="Trainer"
        className="absolute object-cover -top-3 w-20 h-20"
      />
    </div>
  );
}

function TrainerModal() {
  const { trainer } = useTrainerContext();
  const trainerSprite = getTrainerSprite(trainer.avatar);
  const [Modalopen, setModalOpen] = useState(false);
  const handleOpen = () => {
    toast.success("Profile modal opened");
    setModalOpen(true);
  };
  const handleClose = () => {
    toast.success("Profile modal closed");
    setModalOpen(false);
  };
  return (
    <Dialog open={Modalopen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <ProfileButton handleClick={handleOpen} sprite={trainerSprite} />
      </DialogTrigger>
      <DialogContent
        aria-describedby="trainer-info-modal"
        tabIndex={-1}
        className="w-90 gap-y-2! noSelect pb-9"
      >
        <DialogHeader></DialogHeader>

        <DialogTitle className="hidden">Trainer Info</DialogTitle>
        <DialogDescription id="trainer-info-modal" className="sr-only">
          Edit the selected Pokémon's details.
        </DialogDescription>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className=" flex flex-col items-center gap-1 text-[15pt]! Text-primary! font-semibold!"
        >
          <h1>TRAINER INFO</h1>
          <h2 className="mt-3 text-[15pt]!">{trainer.name}</h2>
          <h2 className="text-[12pt]!">{trainer.email}</h2>
        </motion.div>
        <div className="text-[9pt]! pt-3 pb-0 items-center flex flex-col gap-3 justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="mb-5 border-0 border-gray-700 relative overflow-hidden w-50 h-50 rounded-full bg-gray-300"
          >
            <img
              src={trainerSprite}
              alt="Trainer"
              className="pixelImage absolute object-cover -top-15 w-100 h-100"
            />
          </motion.div>
          <SubmitButton onSubmit={() => {}} ball="02" name="Logout" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
