import { cn, getElementSprite } from "@/lib/utils";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import * as Popover from "@radix-ui/react-popover";
import toast from "react-hot-toast";
import { Button } from "./button";
import InputBar from "./input-bar";
const OPTIONS = ["Fire", "Water", "Grass", "Electric", "Rock", "Psychic"];
export default function Dropdown({
  onClick,
  selected = "",
  extraStyling,
}: {
  onClick?: () => void;
  selected: string;
  extraStyling?: string;
}) {
  return (
    <div className="relative cursor-pointer " onClick={onClick}>
      <h3 className="absolute left-1/2 z-30 top-1/2 -translate-y-1/2 -translate-x-1/2">
        {selected}
      </h3>
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
  type?: "text" | "icon";
  selected: string;
  onSelect: (value: string) => void;
};

export function MultiSelectDropdown({
  options,
  width = "50",
  type = "text",
  selected,
  onSelect,
}: TDropDown) {
  const [open, setOpen] = useState(false);

  const toggleOption = (option: string) => {
    toast.success(option + " selected");
    onSelect(option);
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
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
      />
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger className="bg-red-200 absolute" />
        <Popover.Portal>
          <Popover.Content
            align="start"
            side="bottom"
            sideOffset={1}
            id={type}
            className="absolute bg-white border rounded-md shadow-md p-1 w-56 z-50"
          >
            <div className="flex flex-col gap-0">
              {options.map((option) => {
                const isSelected = selected === option;
                return (
                  <label
                    key={option}
                    onClick={() => toggleOption(option)}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100",
                      "",
                      isSelected && "bg-gray-200 font-bold"
                    )}
                  >
                    {type == "text" && option}
                    {type == "icon" && (
                      <img
                        src={getElementSprite(option as any)}
                        alt={option}
                        className="w-5 h-5"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}
