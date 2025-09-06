import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import Pokeball from "./pokeball";
import Link from "next/link";

export default function Nav({
  items,
}: {
  items: { name: string; ball: string; href: string }[];
}) {
  return (
    <nav className="my-5 sm:my:0 flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center">
      {items.map((item, index) => {
        return (
          <div
            className=" flex not-even:flex-row even:flex-row-reverse gap-2 items-center h-8 group"
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
            <Link href={item.href} tabIndex={-1}>
              <Button
                key={item.name}
                className={cn(
                  " w-25 h-8transition-transform duration-300 active:scale-90",
                  index % 2 === 0
                    ? "group-hover:-translate-x-1"
                    : "group-hover:translate-x-1"
                )}
              >
                {item.name}
              </Button>
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
