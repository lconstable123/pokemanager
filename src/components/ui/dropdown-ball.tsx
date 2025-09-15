"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { use, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import * as Popover from "@radix-ui/react-popover";
import toast from "react-hot-toast";
import { Button } from "./button";
import Pokeball from "../../../components/pokeball";
const OPTIONS = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];
export default function Dropdown({
  currentBall = "02",
  onClick,

  extraStyling,
}: {
  onClick?: () => void;
  // selected: string[];
  extraStyling?: string;
  currentBall?: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative cursor-pointer w-8 "
      onClick={onClick}
    >
      <FaCaretDown
        className={cn(
          "z-30 w-4 h-4 absolute -right-2 top-2 -translate-y-1/2 border-2 border-black rounded-full bg-white "
        )}
      />

      <Pokeball type={currentBall} size={10} fill={true} shadow={true} />
    </motion.div>
  );
}

type TDropDown = {
  options: string[];
  width?: string;
  selected: string;
  onSelect: (value: string) => void;
};

export function MultiSelectBallDropdown({
  options,
  width = "50",
  selected,
  onSelect,
}: TDropDown) {
  const [open, setOpen] = useState(false);

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
        currentBall={selected}
        extraStyling={`w-${width} `}
        onClick={handletoggleOpen}
      />
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger className="bg-red-200 absolute" />
        <Popover.Portal>
          <Popover.Content
            align="start"
            side="bottom"
            sideOffset={1}
            id="ball"
            className="absolute bg-white border rounded-md shadow-md p-3 w-33 z-50"
          >
            <div className="flex flex-wrap gap-1 items-center justify-center">
              {OPTIONS.map((option) => {
                const isSelected = selected === option;
                return (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className=" w-8 h-8 p-1 rounded-full  "
                    key={option}
                    onClick={() => {
                      // setCurrentBall(option);
                      onSelect(option);
                      // toggleOption(option);
                      handleOpenChange(false);
                    }}
                  >
                    <Pokeball
                      type={option}
                      size={10}
                      fill={true}
                      shadow={true}
                    />
                  </motion.div>
                );
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
