import { cn, getElementSprite } from "@/lib/utils";
import React, { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import * as Popover from "@radix-ui/react-popover";
import toast from "react-hot-toast";
import { Button } from "./button";
const OPTIONS = ["Fire", "Water", "Grass", "Electric", "Rock", "Psychic"];
export default function Dropdown({
  onClick,
  selected = [""],
  extraStyling,
}: {
  onClick?: () => void;
  selected: string[];
  extraStyling?: string;
}) {
  return (
    <div className="relative cursor-pointer " onClick={onClick}>
      <FaCaretDown
        className={cn(
          "z-30 w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2  "
        )}
      />
      <div
        className={cn(
          " transition-all duration-200 file:text-foreground placeholder:text-muted-foreground flex h-9 w-full min-w-0 px-3 py-0 text-base shadow-xs  outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-red-200  focus-visible:ring-ring/50 focus-visible:ring-[10px] ring-amber-300",
          "bg-white border-gray-800 border-2 hardShadow rounded-full",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "h-10 cursor-pointer",
          extraStyling
        )}
      />
    </div>
  );
}

type TDropDown = {
  options: string[];
  width?: string;
  type?: "text" | "icon";
};

export function MultiSelectElmDropdown({
  options,
  width = "50",
  type = "text",
}: TDropDown) {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

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
            className=" absolute bg-white border rounded-md shadow-md p-1  z-50"
          >
            <div className="flex flex-wrap gap-0 w-100">
              {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <label
                    key={option}
                    className="flex items-center flex-wrap gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
                  >
                    {type == "icon" && (
                      <img
                        src={getElementSprite(option as any)}
                        alt={option}
                        className="w-7 h-7"
                        onClick={() => toggleOption(option)}
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
