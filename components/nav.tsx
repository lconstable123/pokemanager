import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import Pokeball from "./pokeball";

export default function Nav({
  items,
}: {
  items: { name: string; ball: string }[];
}) {
  return (
    <nav className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      {items.map((item, index) => {
        return (
          <div
            className=" flex not-even:flex-row even:flex-row-reverse gap-2 items-center h-9 group"
            key={index}
          >
            <div
              className={cn(
                " h-full transition-transform duration-300",
                index % 2 === 0
                  ? "group-hover:-translate-x-4"
                  : "group-hover:translate-x-4"
              )}
            >
              <Pokeball type={item.ball} size={30} fill={true} shadow={true} />
            </div>
            <Button
              key={item.name}
              className={cn(
                " w-30 h-full transition-transform duration-300 active:scale-90",
                index % 2 === 0
                  ? "group-hover:-translate-x-2"
                  : "group-hover:translate-x-2"
              )}
            >
              {item.name}
            </Button>
          </div>
        );
      })}
    </nav>
  );
}
