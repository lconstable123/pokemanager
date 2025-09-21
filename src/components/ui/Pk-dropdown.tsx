"use client";
import { cn, getElementSprite } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretLeft, FaCaretRight } from "react-icons/fa";
import * as Popover from "@radix-ui/react-popover";
import InputBar from "./input-bar";
import { motion } from "framer-motion";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { useDexContext } from "@/lib/contexts/DexContext";
import toast from "react-hot-toast";

type TDropDown = {
  options: string[];
  width?: string;
  type?: "text" | "icon";
  selected: string;
  onSelect: (value: string) => void;
  page?: number;
  OpenStatus?: boolean;
  handletoggleOpen?: () => void;
  handleOpenChange?: (newOpen: boolean) => void;
  userJourney?: "initial" | "addpk" | "addname";
};

export function PkDropdownAndModal({
  options,
  width = "50",
  type = "text",
  selected,
  onSelect,
  OpenStatus,
  handletoggleOpen,
  handleOpenChange,
  userJourney,
}: TDropDown) {
  const { isMobile } = usePokeAppContext();

  const {
    handlePkPageNext,
    handlePkPagePrev,
    dexloading,
    PkDropdownPage,
    maxPkDropdownPages,
  } = useDexContext();
  const toggleOption = (option: string) => {
    onSelect(option);

    handletoggleOpen?.();
  };

  return (
    <>
      {userJourney === "initial" && (
        <div className="pointer-events-none select-none text-[9pt] absolute left-12 top-[37px] opacity-35 h-4 z-30">
          Please select a pokemon
        </div>
      )}
      <PkDropdown
        extraStyling={`w-${width} relative`}
        selected={selected}
        onClick={handletoggleOpen}
        userJourney={userJourney}
      />
      <Popover.Root open={OpenStatus} onOpenChange={handleOpenChange}>
        <Popover.Trigger className="bg-red-200 w-full" />
        <Popover.Portal>
          <Popover.Content
            align="center"
            side="top"
            sideOffset={!isMobile ? -150 : -270}
            id={type}
            className="flex overflow-hidden flex-col items-center pt-2 bg-white border-2 border-black rounded-md shadow-md p-0 sm:w-160 w-100 z-50"
          >
            <div className="flex flex-col gap-y-1 flex-wrap sm:h-30 h-60 pb-2 items-center content-start justify-start ">
              {!dexloading &&
                options.map((option) => {
                  const isSelected = selected === option;
                  return (
                    <motion.label
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      htmlFor={option}
                      key={option}
                      onClick={() => toggleOption(option)}
                      className={cn(
                        "text-[9pt] overflow-hidden relative border-0 w-26 h-6 flex items-center gap-0 cursor-pointer px-2 py-1 rounded hover:bg-gray-100",
                        "",
                        isSelected && "bg-gray-200 font-bold"
                      )}
                    >
                      <span className="font-semibold absolute left-1/2 -translate-x-1/2 top-1 noSelect overflow-hidden">
                        {option.slice(0, 9)}
                      </span>
                    </motion.label>
                  );
                })}
              {dexloading && <Loader />}
            </div>
            <Pagination
              page={PkDropdownPage}
              maxPages={maxPkDropdownPages}
              onClickLeft={handlePkPagePrev}
              onClickRight={handlePkPageNext}
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}

const Pagination = ({
  onClickLeft,
  onClickRight,
  page = 0,
  maxPages,
}: {
  onClickLeft: () => void;
  onClickRight: () => void;
  page: number;
  maxPages: number;
}) => {
  return (
    <div className="  relative flex justify-center items-center    border-t-2 w-full bg-gray-50">
      {page > 0 && (
        <div className="w-20  cursor-pointer" onClick={onClickLeft}>
          <FaCaretLeft className={cn("z-30 w-6 h-6")} />
        </div>
      )}
      <div className="absolute left-1/2 -translate-x-1/2 text-[8pt] text-gray-700 italic my-1 noSelect">
        page {page}
      </div>

      <div className="ml-auto flex w-20 cursor-pointer" onClick={onClickRight}>
        <FaCaretRight className={cn("z-30 w-6 h-6 ml-auto")} />
      </div>
    </div>
  );
};

const Loader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, delay: 0.4 }}
      className="noSelect w-full h-full animate-pulse flex items-center justify-center "
    >
      <div className="loader">Loading</div>
    </motion.div>
  );
};

export default function PkDropdown({
  onClick,
  selected = "",
  extraStyling,
  userJourney,
}: {
  onClick?: () => void;
  selected: string;
  extraStyling?: string;
  userJourney?: "initial" | "addpk" | "addname";
}) {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <FaCaretDown
        className={cn(
          "z-30 w-6 h-6 absolute left-3 top-1/2 -translate-y-1/2  "
        )}
      />
      <h3 className="absolute left-1/2 z-30 top-1/2 -translate-y-1/2 -translate-x-1/2">
        {selected}
      </h3>
      <FaCaretDown
        className={cn(
          " z-30 w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2  "
        )}
      />
      <div
        className={cn(
          "",
          userJourney === "initial" &&
            "animate-pulse border-2 border-red-300 rounded-full "
        )}
      >
        <InputBar extraStyling={extraStyling} />
      </div>
    </div>
  );
}
