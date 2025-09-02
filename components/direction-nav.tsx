import React from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
type DirectionNavProps = {
  direction: "left" | "right";
  trainer: number;
  handleSetTrainer: React.Dispatch<React.SetStateAction<number>>;
  trainerAmt: number;
  isEngaged: boolean;
};
export default function DirectionNav({
  direction,
  handleSetTrainer,
  trainerAmt,
  isEngaged,
}: DirectionNavProps) {
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    direction: "left" | "right"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    // const newPos = direction === "left" ? trainer - 1 : trainer + 1;
    handleSetTrainer((prev) =>
      direction === "left"
        ? (prev - 1 + trainerAmt) % trainerAmt
        : (prev + 1) % trainerAmt
    );
  };

  if (direction === "right") {
    return (
      <button
        onClick={(e) => handleClick(e, "right")}
        className={`cursor-pointer py-12 transition-quick ${
          !isEngaged ? "opacity-0" : "opacity-100"
        } `}
      >
        <BiSolidRightArrow
          width={20}
          height={20}
          className="text-gray-700 cursor-pointer"
        />
      </button>
    );
  } else {
    return (
      <button
        onClick={(e) => handleClick(e, "left")}
        className={`cursor-pointer py-12 transition-quick ${
          !isEngaged ? "opacity-0" : "opacity-100"
        } `}
      >
        <BiSolidLeftArrow
          width={20}
          height={20}
          className="text-gray-700 cursor-pointer"
        />
      </button>
    );
  }
}
