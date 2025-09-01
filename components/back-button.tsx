import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function BackButton() {
  return (
    <Link href={"/"} className=" absolute top-3 left-3 z-4">
      <Button
        className={cn(
          " w-25 h-7 transition-transform duration-300 active:scale-80"
        )}
      >
        back
      </Button>
    </Link>
  );
}
