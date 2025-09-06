import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function BackButton() {
  return (
    <Link href={"/"} tabIndex={-1} className=" z-4 focus:outline-none">
      <Button
        className={cn(
          " cursor-pointer w-25 h-7 transition-transform duration-300 active:scale-80 hover:scale-105"
        )}
      >
        back
      </Button>
    </Link>
  );
}
