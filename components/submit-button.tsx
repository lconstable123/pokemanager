import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import Pokeball from "./pokeball";

export default function SubmitButton({
  ball,
  name,
  onSubmit,
  ballPadding = "150px",
}: {
  ball: string;
  name: string;
  onSubmit: () => void;
  ballPadding?: string;
}) {
  return (
    <div
      className={`hover:-translate-x-2 transition-transform duration-300 flex flex-row gap-2 items-center h-10 w-[${ballPadding}] group`}
    >
      <Button
        type="submit"
        className={cn(
          " w-30 h-8 transition-transform duration-300 active:scale-90",
          "group-hover:translate-x-1"
        )}
      >
        {name}
      </Button>
      <div
        className={cn(
          " h-9 w-9 transition-transform duration-300",
          "group-hover:translate-x-4"
        )}
      >
        <Pokeball type={ball} size={30} fill={true} shadow={true} />
      </div>
    </div>
  );
}
