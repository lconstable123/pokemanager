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
import { Delete } from "lucide-react";
import DeleteButton from "./delete-button";

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
      className="hover:scale-110 scale-100 transition-all border-1 border-gray-700 relative overflow-hidden w-11 h-11 rounded-full bg-red-300"
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
        className="border-3  border-black bg-yellow-100 overflow-hidden w-80 flex justify-center items-center flex-col gap-y-1! noSelect pb-2 "
      >
        <div className="absolute bottom-0 ditheredGrad w-full h-20 -z-10 opacity-20 " />
        <div className="absolute top-0 rotate-180 ditheredGrad w-full h-20 -z-10 opacity-20 " />
        {/* .bg1 {
  background-image: url("/pokebg_2.jpg");
  background-size: 40px auto;
}
.ditheredGradRed {
  background-image: url("/ditheredgrad.jpg");
  background-size: auto 100%;
}
.ditheredGrad {
  background-image: url("/ditheredgrad_bw.jpg");
  background-size: auto 100%;
} */}
        <DialogHeader></DialogHeader>

        <DialogTitle className="hidden">Trainer Info</DialogTitle>
        <DialogDescription id="trainer-info-modal" className="sr-only">
          Edit the selected Pokémon's details.
        </DialogDescription>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className=" flex flex-col items-center text-center text-[14pt]! gap-1 Text-primary! font-semibold!"
        >
          <h1 className="text-3xl!  p-1 rounded-2xl">TRAINER INFO</h1>
          <h2 className="font-bold! mt-3 text-[15pt]!">{trainer.name}</h2>
          <h2 className=" text-[12pt]!">{trainer.email}</h2>
        </motion.div>
        <div className="text-[9pt]! pt-4 pb-0 items-center flex flex-col gap-1 justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.0 }}
            className="mb-5 border-10 ring-2 ring-yellow-400/40 border-yellow-200 relative overflow-hidden w-50 h-50 rounded-full bg-yellow-300/70"
          >
            <img
              src={trainerSprite}
              alt="Trainer"
              className="pixelImage absolute object-cover -top-15 w-100 h-100"
            />
          </motion.div>
          <div className=" px-4 py-2 rounded-full flex gap-2">
            <SubmitButton
              style={"noball"}
              onSubmit={() => {}}
              ball="02"
              name="Logout"
            />
            <DeleteButton
              handleDelete={() => {
                toast.success("Account deletion initiated");
                // Add account deletion logic here
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
