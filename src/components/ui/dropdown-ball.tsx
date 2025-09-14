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
  selected = [""],
  extraStyling,
}: {
  onClick?: () => void;
  selected: string[];
  extraStyling?: string;
  currentBall?: string;
}) {
  // const [currentBall, setCurrentBall] = useState("02");
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="relative cursor-pointer w-10 "
      onClick={onClick}
    >
      <FaCaretDown
        className={cn(
          "z-30 w-6 h-6 absolute -right-2 top-2 -translate-y-1/2 border-2 border-black rounded-full bg-white "
        )}
      />

      <Pokeball type={currentBall} size={10} fill={true} shadow={true} />
    </motion.div>
  );
}

type TDropDown = {
  options: string[];
  width?: string;
};

export function MultiSelectBallDropdown({ options, width = "50" }: TDropDown) {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [currentBall, setCurrentBall] = useState("02");
  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
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
        currentBall={currentBall}
        extraStyling={`w-${width} `}
        selected={selected}
        onClick={handletoggleOpen}
      />
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger className="bg-red-200 absolute" />
        <Popover.Portal>
          <Popover.Content
            align="start"
            side="bottom"
            sideOffset={1}
            className=" absolute bg-white border rounded-md shadow-md p-3 w-36 z-50"
          >
            <div className="flex flex-wrap gap-1">
              {OPTIONS.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    className=" w-9 h-9 p-1 rounded-full  "
                    key={option}
                    onClick={() => {
                      setCurrentBall(option);
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
