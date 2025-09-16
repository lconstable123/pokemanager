"use client";
import { FaPlus } from "react-icons/fa";
import { useIsMobile } from "@/lib/hooks";
import { motion, Reorder, useAnimation } from "framer-motion";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import { Element, TPokemon } from "@/lib/types";
import { getElementSprite } from "@/lib/utils";

import LineupBar from "../../../../components/lineup-bar";
import { useEffect, useState } from "react";
import { b, tr } from "framer-motion/client";
import WindowBg from "../../../../components/window-bg/window-bg";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import toast from "react-hot-toast";
const features = [
  "Full Stack with Next",
  "Optimistic Frontend",
  "Next-Auth",
  "Prisma and Postgres",
];

export default function Home() {
  const { isMobile, isSmall } = useIsMobile();
  const { lineUp, trainer, slots, isReordering } = useTrainerContext();

  return (
    <WholeSection>
      <PokeGrid>
        {slots.map((slotId, index) => (
          <div key={slotId} className="relative">
            <GridNumber index={index} isReordering={isReordering} />
            <PokemonCard
              key={slotId}
              pokemon={lineUp[index]}
              id={slotId}
              lineUpPos={index}
            />
          </div>
        ))}
      </PokeGrid>
    </WholeSection>
  );
}

//---------------------------------------------------
function PokeGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className=" px-2 sm:px-7 lg:px-20  rounded-3xl  w-70 sm:w-full sm:h-full grid grid-cols-1 grid-rows-6 sm:grid-cols-3 sm:grid-row-2  gap-x-3 gap-y-4 sm:gap-y-4  mb-1 ">
      {children}
    </div>
  );
}

function GridNumber({
  index,
  isReordering,
}: {
  index: number;
  isReordering?: boolean;
}) {
  return (
    <div
      className={`${
        isReordering ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500 noSelect z-1 absolute  -top-2 left-0 sm:left-2 md:left-0  lg:left-0 2xl:left-10 border-2 font-black border-yellow-300 text-yellow-700 text-sm p-4 w-4 h-4 rounded-full flex items-center justify-center bg-yellow-100`}
    >
      {index + 1}
    </div>
  );
}

function WholeSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative mb-30  sm:mb-3 mt-5 flex justify-center">
      {children}
    </section>
  );
}

export function PokemonCard({
  pokemon,
  id,
  lineUpPos,
}: {
  pokemon?: TPokemon;
  id: string;
  lineUpPos: number;
}) {
  const { lineUp, handleBallClick, ballEdit, slots } = useTrainerContext();
  const cardAnimationControls = useAnimation();

  const handleAnimateIn = () => {
    slots.forEach((_, index) => {
      cardAnimationControls.start((custom) => ({
        opacity: 1,
        duration: 2,
        transition: { delay: custom * 0.02 },
      }));
    });
  };

  useEffect(() => {
    handleAnimateIn();
  }, []);

  return (
    <motion.div
      layout="position"
      layoutScroll
      custom={lineUpPos}
      initial={{ opacity: 0 }}
      animate={cardAnimationControls}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="h-45 relative flex flex-col items-center gap-0"
      onClick={() => handleBallClick?.(lineUpPos)}
    >
      <PkCardImage
        pokemon={pokemon}
        highlighted={ballEdit === lineUpPos}
        index={lineUpPos}
      />
      {pokemon && <PKCardDetails pokemon={pokemon} />}
    </motion.div>
  );
}

//Optional Image and Compulsory BackBubble
export function PkCardImage({
  pokemon,
  highlighted,
  index,
}: {
  pokemon?: TPokemon;
  highlighted: boolean;
  index: number;
}) {
  const { isReordering, ballShiftMode, slots, isShaking, setIsShaking } =
    useTrainerContext();

  const spriteAnimationControls = useAnimation();

  const handleAnimateIn = () => {
    slots.forEach((_, index) => {
      spriteAnimationControls.start((custom) => ({
        scale: 1,
        duration: 0.6,
        transition: { delay: custom * 0.03 },
      }));
    });
  };

  useEffect(() => {
    handleAnimateIn();
  }, []);
  // If no data, return empty bubble
  if (!pokemon)
    return (
      <div className="noSelect relative  w-35 h-35">
        <div className="noSelect z-5 absolute -top-2 -left-6 "></div>
        <AddBubble />
      </div>
    );
  // If data, return populated entry

  return (
    <div className={` noSelect relative  w-35 h-35`}>
      <div className="noSelect z-5 absolute -top-2 -right-6 ">
        <PKCardTypes types={pokemon.type} />
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={spriteAnimationControls}
        custom={index}
        className={`
           w-full group  h-full  absolute z-3 `}
      >
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className={`${
            highlighted ? " scale-120" : "scale-102 hover:scale-110   "
          } w-full h-full cursor-pointer   absolute z-3 user-select-none pixelImage `}
        />
      </motion.div>
      <BackBubble editing={isReordering} />
    </div>
  );
}

//Title and Name
export function PKCardDetails({ pokemon }: { pokemon: TPokemon }) {
  return (
    <div className="noSelect text-center text-md leading-tight tracking-wider! ">
      <h3 className="text-md font-bold">{pokemon.name}</h3>
      <hr className="border-1 mb-[2px] border-gray-300 " />
      <p className="secondary-p-styling  mb-1">
        <span className="text-[9pt]! border-2 border-gray-300 bg-gray-100 rounded-full px-2 text-center">
          lvl {pokemon.level}
        </span>
        {" " + pokemon.species}
      </p>
    </div>
  );
}

// TypeBubbles
function PKCardTypes({ types }: { types: Element[] }) {
  return (
    <div className="mt-1 flex flex-col gap-0 ">
      {types.map((type, index) => (
        <img
          key={index}
          src={getElementSprite(type)}
          alt={type}
          className="w-5 h-5 object-cover z-3 user-select-none pixelImage pointer-events-none"
        />
      ))}
    </div>
  );
}

function BackBubble({ editing = false }: { editing?: boolean }) {
  return (
    <div
      className={` transition-all duration-700 absolute m-1 noSelect inset-0 z-1  rounded-full ${
        editing ? "bg-gray-100 scale-70 " : "bg-gray-200 scale-100"
      }`}
    />
  );
}

function AddBubble() {
  const { setAddPkModalOpen } = usePokeAppContext();
  return (
    <div
      onClick={() => {
        toast.success("Opening add Pokémon modal");
        setAddPkModalOpen(true);
      }}
      className="cursor-pointer transition-all  hover:bg-gray-100 bg-white duration-700  absolute noSelect inset-0 flex justify-center items-center z-1 border-4 border-gray-200  rounded-full"
    >
      <FaPlus className="m-auto w-7 h-7 text-gray-400" />
    </div>
  );
}
