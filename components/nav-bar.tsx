"use client";
import React, { useState } from "react";
import BackButton from "./back-button";

import { cn, getTrainerSprite } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import SubmitButton from "./submit-button";
import DeleteButton from "./delete-button";
import { DeleteTrainer, SignOutTrainer } from "@/lib/actions";
import { TTrainer } from "@/lib/types";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { usePathname } from "next/navigation";
type TNavBar = {
  Navlink?: string;
};

export default function NavBar({ Navlink = "/" }: TNavBar) {
  const { trainer } = usePokeAppContext();
  const pathname = usePathname();

  const isAccount = pathname === "/account";
  const isAuth =
    pathname.startsWith("/sign-up") || pathname.startsWith("/login");

  return (
    <nav className=" flex pt-2 pl-4 pr-3 items-center justify-between w-full  z-4">
      {isAuth && <BackButton />}
      {isAccount && trainer && (
        <>
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.7 }}
            className="text-[9pt]  absolute left-1/2  -translate-x-1/2 text-center italic font-light noSelect"
          >
            Welcome back,{" "}
            <span className="font-semibold">
              {trainer?.name || "MissingNo"}
            </span>
            . Feel free to add, edit, or rerarrange your team!
          </motion.h3>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className=" ml-auto flex items-center gap-3"
          >
            <div className="min-h-12 mr-auto ">
              <TrainerModal />
            </div>
          </motion.div>
        </>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={() => {
        handleClick();
      }}
      className={cn(
        " origin-top-right noSelect duration-300 hover:scale-150 scale-140 transition-all border-2 ring-2 hover:ring-4 hover:translate-y-1 ring-red-200 border-gray-700 relative overflow-hidden w-10 h-10 rounded-full bg-red-300 hover:bg-blue-300"
        // "hover:w-30 hover:h-30"
      )}
    >
      <img
        src={sprite}
        alt="Trainer"
        className="not-hover:pixelImage absolute object-cover -top-3 w-20 h-20"
      />
    </motion.div>
  );
}

function TrainerModal() {
  const { handleSignOut, handlePageTransition } = usePokeAppContext();
  const { trainer } = usePokeAppContext();
  const SafeTrainer: TTrainer = trainer ?? {
    id: "unknown",
    name: "Unknown",
    email: "unknown@example.com",
    avatar: 1,
    lineup: [],
  };
  const trainerSprite = getTrainerSprite(SafeTrainer.avatar);
  // toast.success("Loaded trainer: " + SafeTrainer.avatar);
  const [Modalopen, setModalOpen] = useState(false);
  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };
  return (
    <Dialog open={Modalopen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        {trainerSprite && (
          <ProfileButton handleClick={handleOpen} sprite={trainerSprite} />
        )}
      </DialogTrigger>
      <DialogContent
        aria-describedby="trainer-info-modal"
        tabIndex={-1}
        className="border-3  border-yellow-800 bg-yellow-100 overflow-hidden w-80 flex justify-center items-center flex-col gap-y-1! noSelect pb-2 "
      >
        <div className="absolute bottom-0 ditheredGrad w-full h-20 -z-10 opacity-20 " />
        <div className="absolute top-0 rotate-180 ditheredGrad w-full h-20 -z-10 opacity-20 " />
        <DialogHeader></DialogHeader>
        <DialogTitle className="hidden">Trainer Info</DialogTitle>
        <DialogDescription id="trainer-info-modal" className="sr-only">
          Trainer info.
        </DialogDescription>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className=" flex flex-col items-center text-center text-[14pt]! gap-1 Text-primary! font-semibold!"
        >
          <h1 className="text-3xl!  p-1 rounded-2xl">TRAINER INFO</h1>
          <h2 className="font-bold! mt-3 text-[15pt]!">{SafeTrainer.name}</h2>
          <h2 className=" text-[12pt]!">{SafeTrainer.email}</h2>
        </motion.div>
        <div className="text-[9pt]! pt-4 pb-0 items-center flex flex-col gap-1 justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.0 }}
            className="mb-5 border-10 ring-2 ring-yellow-400/40 border-yellow-200 relative overflow-hidden w-50 h-50 rounded-full bg4"
          >
            <img
              src={trainerSprite}
              alt="Trainer"
              className={`${
                SafeTrainer.avatar === 0 ? "w-40 h-50 " : "w-100 h-100 -top-15 "
              } pixelImage animate-breathing absolute object-cover `}
            />
          </motion.div>
          <div className=" px-4 py-2 rounded-full flex gap-2">
            <SubmitButton
              type={"button"}
              style={"noball"}
              onClick={() => {
                setModalOpen(false);
                handleSignOut();
              }}
              ball="02"
              name="Logout"
            />
            <DeleteButton
              handleDelete={async () => {
                // toast.success("Signed out");
                // await sleep(100);
                const error = await DeleteTrainer(SafeTrainer.email);
                if (error) {
                  toast.error("Error deleting trainer");
                } else {
                  await SignOutTrainer();
                  setModalOpen(false);
                  handlePageTransition("/", 0.15);
                }
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
