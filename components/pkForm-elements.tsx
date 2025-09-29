"use client";
import React, { Suspense, use, useEffect } from "react";
import { motion } from "framer-motion";

import PlaceholderPk from "./placeholder-pk";
import { cn, getElementSprite } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { FaCaretDown } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Element } from "@/lib/types";
import { useSingleImageLoader } from "@/lib/useImageLoader";
import { is } from "zod/v4/locales";

export const PokeImageField = ({
  children,
  image,
  isUrlLoaded,
  elements,
  clickhandle,
  userJourney,
}: {
  children: React.ReactNode;
  image?: string | null;
  isUrlLoaded: boolean;
  elements: string[];
  clickhandle: () => void;
  userJourney?: "initial" | "addpk" | "addname";
}) => {
  const imageLoaded = useSingleImageLoader(image || "");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-6 flex justify-center relative  h-full "
    >
      <div className="absolute -left-5 top-0 z-10">{children}</div>
      <div className="absolute -right-20 -top-2 w-20 h-20">
        {isUrlLoaded && elements && <PKCardTypes types={elements} />}
      </div>
      <div
        onClick={() => {
          clickhandle();
        }}
        className="border-2  ring-blue-200 border-blue-100 ring-3  cursor-pointer relative mt-1   overflow-hidden w-50 h-50 rounded-full bg2 "
      >
        {!imageLoaded || !isUrlLoaded || image === null ? (
          <PlaceholderPk
            text={"Add a pokemon"}
            loading={!isUrlLoaded}
            userJourney={userJourney}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute w-60 h-60  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <img
              src={image}
              alt={"pokemon sprite"}
              className={`
            scale-102 animate-breathing hover:scale-110 
           w-full h-full cursor-pointer absolute z-3 user-select-none pixelImage `}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export const VertFields = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-row gap-x-3 flex w-full items-center justify-center"
    >
      {children}
    </motion.div>
  );
};

export const FormLabel = ({
  lblfor,
  header,
}: {
  lblfor: string;
  header: string;
}) => {
  return (
    <Label className="" htmlFor={lblfor}>
      <h3 className="text-md font-bold text-[10pt] tracking-wider my-0 ">
        {header}
      </h3>
    </Label>
  );
};

export const SearchFilterButton = ({
  handleClick,
  isSearchOpen,
}: {
  handleClick: () => void;
  isSearchOpen: boolean;
}) => {
  return (
    <div
      onClick={handleClick}
      className="group relative mt-6 mb-0 w-full px-10 flex items-center cursor-pointer"
    >
      <Border />
      <h3 className=" transition-all duration-100 absolute top-0 group-hover:scale-105 scale-100 -translate-y-1/2 left-1/2 -translate-x-1/2 text-[9pt] bg-white border-2 rounded-full px-2 py-1 font-bold">
        Search Filter
      </h3>
      <FaCaretDown
        className={cn(
          "transition-all duration-100  group-hover:scale-105 scale-100 z-30 w-4 h-4 absolute right-9 top-1/2 -translate-y-1/2 border-2 border-black rounded-full bg-white ",
          isSearchOpen ? "rotate-180" : "rotate-0"
        )}
      />
      <FaCaretDown
        className={cn(
          "transition-all duration-100  group-hover:scale-105 scale-100 z-30 w-4 h-4 absolute left-9 top-1/2 -translate-y-1/2 border-2 border-black rounded-full bg-white ",
          isSearchOpen ? "rotate-180" : "rotate-0"
        )}
      />
    </div>
  );
};

export function PKCardTypes({ types }: { types: string[] }) {
  return (
    <div className="mt-1 flex flex-col gap-0 ">
      {types &&
        types.map((type, index) => (
          <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              duration: 0.2,
              delay: 0.1 + index * 0.05,
            }}
            key={index}
            src={getElementSprite(type as Element)}
            alt={type}
            className="w-8 h-8 object-cover z-3 user-select-none pixelImage pointer-events-none"
          />
        ))}
    </div>
  );
}

export const Border = () => {
  return <hr className="relative border-1 w-full " />;
};

export const FormHeader = ({ mode }: { mode?: "add" | "edit" }) => {
  return (
    <>
      <DialogHeader></DialogHeader>
      <DialogTitle className="hidden">
        {mode === "edit" ? "Edit Pokemon" : "Add Pokemon"}
      </DialogTitle>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="ml-1 text-center flex flex-col items-center text-[15pt]! Text-primary! font-semibold!"
      >
        <h1>{mode === "edit" ? "Edit Pokemon" : "Add Pokemon"}</h1>
      </motion.div>
    </>
  );
};
