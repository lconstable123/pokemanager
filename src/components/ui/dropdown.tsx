import { cn, getElementSprite } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { FaCaretDown, FaCaretLeft, FaCaretRight } from "react-icons/fa";
import * as Popover from "@radix-ui/react-popover";
import toast from "react-hot-toast";
import { Button } from "./button";
import InputBar from "./input-bar";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
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
  page?: number;
};

export function MultiSelectDropdown({
  options,
  width = "50",
  type = "text",
  selected,
  onSelect,
}: TDropDown) {
  const [open, setOpen] = useState(false);
  const {
    handlePkPageNext,
    handlePkPagePrev,

    PkDropdownPage,
    maxPkDropdownPages,
  } = usePokeAppContext();
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
  useEffect(() => {
    toast.success("page " + (PkDropdownPage + 1));
  }, [PkDropdownPage]);
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
            className="absolute bg-white border rounded-md shadow-md p-0 w-56 z-50"
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
    <div className=" relative flex justify-between mt-2 border-t w-full bg-gray-50">
      {page > 0 && (
        <div className="w-20 cursor-pointer" onClick={onClickLeft}>
          <FaCaretLeft className={cn("z-30 w-6 h-6")} />
        </div>
      )}
      <div className="absolute left-1/2 -translate-x-1/2 text-[8pt] text-gray-700 italic my-1">
        page {page + 1}
      </div>

      <div className="ml-auto flex w-20 cursor-pointer" onClick={onClickRight}>
        <FaCaretRight className={cn("z-30 w-6 h-6 ml-auto")} />
      </div>
    </div>
  );
};
