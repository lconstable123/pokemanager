import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
type Tpokebutton = {
  text?: string;
  link?: string;
  type?: "nav" | "action";
  modeActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

export default function PokeButton({
  text = "back",
  link = "/",
  type = "nav",
  onClick = () => {},
  modeActive = false,
  disabled = false,
}: Tpokebutton) {
  if (type === "nav") {
    return (
      <Link href={link} tabIndex={-1} className=" z-4 focus:outline-none">
        <Button
          className={cn(
            "  cursor-pointer w-25 h-7 transition-transform duration-300 active:scale-80 hover:scale-105",
            {
              "opacity-50  pointer-events-none": disabled,
            }
          )}
        >
          {text}
        </Button>
      </Link>
    );
  }
  if (type === "action") {
    return (
      <Button
        onClick={onClick}
        className={cn(
          "transition-all z-4 focus:outline-none cursor-pointer w-25 h-7  duration-300  hover:scale-105",
          {
            "bg-yellow-100 border-yellow-300 text-yellow-900 scale-105":
              modeActive === true,
            "opacity-70  pointer-events-none": disabled,
          }
        )}
      >
        {text}
      </Button>
    );
  }
}
