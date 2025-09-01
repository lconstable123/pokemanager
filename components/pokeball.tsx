import { cn } from "@/lib/utils";
import React from "react";
type pokeballprops = {
  type: string;
  size?: number;
  fill?: boolean;
  shadow?: boolean;
};
export default function Pokeball({
  type,
  size = 18,
  fill = false,
  shadow = true,
}: pokeballprops) {
  return (
    <div className={cn("pointer-events-none", fill ? "w-full h-full" : "")}>
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
