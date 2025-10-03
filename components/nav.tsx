"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import Pokeball from "./pokeball";
import Link from "next/link";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";

export default function Nav({
  items,
}: {
  items: { name: string; ball: string; href: string }[];
}) {
  const { handlePageTransition } = usePokeAppContext();
  return (
    <nav className="mb-6 my-0 sm:my-0 md:my-0 flex flex-col sm:flex-row gap-4 sm:gap-5 animate-pulsing-subtle justify-center">
      {items.map((item, index) => {
        return (
          <div
            className=" flex not-even:flex-row even:flex-row-reverse gap-1.5 items-center h-8 group"
            key={index}
          >
            <div
              className={cn(
                " h-full transition-transform duration-300",
                index % 2 === 0
                  ? "group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
              )}
            >
              <Pokeball type={item.ball} size={30} fill={true} shadow={true} />
            </div>

            <Button
              onClick={() => handlePageTransition(item.href, 0.15)}
              key={item.name}
              className={cn(
                " w-25 h-8 transition-transform duration-300 bg-yellow-100 text-yellow-900 border-yellow-400 active:scale-90",
                index % 2 === 0
                  ? "group-hover:translate-x-1 "
                  : "group-hover:-translate-x-1 "
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
