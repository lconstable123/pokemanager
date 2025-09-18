"use client";
import { cn, getElementSprite } from "@/lib/utils";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import * as Popover from "@radix-ui/react-popover";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "./button";
import clsx from "clsx";
import InputBar from "./input-bar";
import { elmOptions } from "@/lib/data";
import { Element } from "@/lib/types";
const OPTIONS = ["Fire", "Water", "Grass", "Electric", "Rock", "Psychic"];
export default function Dropdown({
  onClick,
  // selected = [""],
  extraStyling,
  selectedElm = [],
  type = "elm",
}: {
  onClick?: () => void;
  selected: string[];
  extraStyling?: string;
  selectedElm?: string[];
  type?: "elm" | "gen";
}) {
  return (
    <div className="relative cursor-pointer  w-25" onClick={onClick}>
      <div className="z-200  absolute flex flex-row gap-0 items-center pl-1 h-full  overflow-hidden ">
        {selectedElm?.length > 0 &&
          selectedElm.map((elm, index) => {
            if (type === "elm" && elmOptions.includes(elm as Element))
              return (
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={elm + index}
                  src={getElementSprite(elm as Element)}
                  alt={elm}
                  className="w-7 h-7"
                />
              );
            if (type === "elm")
              return (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={elm + index}
                  className="w-4 h-4 bg-red-400 rounded-full"
                />
              );
            if (type === "gen" && selectedElm.length <= 3)
              return (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={elm + index}
                  className="text-gray-700 flex items-center justify-center h-5 w-full font-bold text-[8pt] ml-1 first:ml-2"
                >
                  {elm}
                </motion.div>
              );
            if (type === "gen" && selectedElm.length > 3 && index === 0)
              return (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={elm + index}
                  className="text-gray-700 flex items-center justify-center h-5 w-full font-bold text-[8pt] ml-0 first:ml-2"
                >
                  {"..."}
                </motion.div>
              );
          })}
        {selectedElm.length == 0 && <p className="text-gray-400 pl-2!">All</p>}
      </div>
      <FaCaretDown
        className={cn(
          "z-30 w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2  "
        )}
      />
      <InputBar extraStyling={extraStyling} />
    </div>
  );
}

type TDropDown = {
  options: string[];
  width?: string;
  type?: "elm" | "gen";
  cap?: number;
  selected: string[];
  onSelect: (value: string[]) => void;
  handleSelect?: () => void;
};

export function MultiSelectFilterDropdown({
  options,
  width = "50",
  type = "elm",
  cap = 1,
  selected,
  onSelect,
  handleSelect,
}: TDropDown) {
  const tooMany = selected.length > cap;
  const [open, setOpen] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const handleElementClick = (option: string) => {
    if (cap !== 0) {
      if (tooMany && !selected.includes(option)) {
        setDisplayError(true);
        handleSelect?.();
        return;
      }
    } else {
      justOption(option);
      handleSelect?.();
      return;
    }
    toggleOption(option);
    setDisplayError(false);
  };
  const justOption = (option: string) => {
    onSelect([option]);
  };

  const toggleOption = (option: string) => {
    onSelect(
      selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option]
    );
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // if (newOpen) toast.success("Dropdown opened");
  };
  const handletoggleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <>
      <Dropdown
        extraStyling={`w-${width} relative`}
        selected={selected}
        onClick={handletoggleOpen}
        selectedElm={selected}
        type={type}
      />
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger className="bg-red-200 absolute" />
        <Popover.Portal>
          <Popover.Content
            align="start"
            side="bottom"
            sideOffset={1}
            id={type}
            className="absolute bg-white border rounded-md shadow-md p-1  z-50"
          >
            <div className="transition-all duration-200 h-full flex flex-wrap items-start justify-center gap-0 w-30">
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <label
                    key={option}
                    className={clsx(
                      "transition-all duration-300 flex items-center justify-center gap-0 cursor-pointer p-0 m-1 rounded hover:scale-100 scale-100",
                      isSelected && "bg-yellow-200 rounded-full"
                    )}
                  >
                    {type == "elm" && (
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.3 }}
                        src={getElementSprite(option as any)}
                        alt={option}
                        className="w-7 h-7"
                        onClick={() => handleElementClick(option)}
                      />
                    )}
                    {type == "gen" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleElementClick(option)}
                        className="flex items-center justify-center h-8 w-8 "
                      >
                        <p className="text-center text-gray-700 p-1 font-bold text-sm ">
                          {option}
                        </p>
                      </motion.div>
                    )}
                  </label>
                );
              })}
            </div>
            {displayError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-red-500! text-[8pt]! text-center leading-tight! tracking-wider! mt-0"
              >
                Select up to 2
              </motion.p>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
