import { cn } from "@/lib/utils";
import { hover } from "framer-motion";
import React from "react";
type pokeballprops = {
  type: string;
  size?: number;
  fill?: boolean;
  shadow?: boolean;
  hoverAnim?: boolean;
};
export default function Pokeball({
  type,
  size = 18,
  fill = false,
  shadow = true,
  hoverAnim = false,
}: pokeballprops) {
  return (
    <div
      className={cn(
        " noSelect ",
        fill ? "w-full h-full" : "",
        hoverAnim
          ? "hover:scale-115 transition-transform duration-200 scale-100"
          : ""
      )}
    >
      <img
        src={`/pokeballs/pokeballs-${type}.svg`}
        width={size}
        height={size}
        className={cn(
          fill ? "w-full h-full" : "",
          shadow ? "hardSVGShadow" : ""
        )}
      />
    </div>
  );
}
