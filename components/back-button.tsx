import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function BackButton() {
  return (
    <Link href={"/"} className="absolute top-5 left-5 z-4">
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
