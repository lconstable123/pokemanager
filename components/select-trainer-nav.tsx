import { cn } from "@/lib/utils";
import React from "react";
type trainerNavProps = {
  trainers: string[];
  selectedTrainer: number;
  handleClick?: (e: React.MouseEvent<HTMLElement>, index: number) => void;
  isEngaged: boolean;
};
export default function SelectTrainerNav({
  trainers,
  selectedTrainer,
  handleClick,
  isEngaged,
}: trainerNavProps) {
  return (
    <nav className="z-3 mt-auto flex flex-row justify-center gap-0">
      {trainers.map((trainer, index) => {
        return (
          <div
            key={trainer}
            onClick={(e) => handleClick?.(e, index)}
            className={`transition-quick px-1 py-3 group cursor-pointer  ${
              !isEngaged ? "opacity-0" : "opacity-100"
            } `}
          >
            <button
              className={cn(
                " transition-all duration-400 h-3 w-3  rounded-full pointer-events-none  ",
                selectedTrainer === index ? "bg-gray-800" : "bg-gray-200"
              )}
            />
          </div>
        );
      })}
    </nav>
  );
}
