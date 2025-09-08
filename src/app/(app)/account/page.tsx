"use client";

import { useIsMobile } from "@/lib/hooks";
import { motion, useAnimation } from "framer-motion";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import { Element, TPokemon } from "@/lib/types";
import { getElementSprite } from "@/lib/utils";

import LineupBar from "../../../../components/lineup-bar";
import { useEffect, useState } from "react";
import { b } from "framer-motion/client";
const features = [
  "Full Stack with Next",
  "Optimistic Frontend",
  "Next-Auth",
  "Prisma and Postgres",
];

export default function Home() {
  const { isMobile, isSmall } = useIsMobile();
  const { lineUp, trainer, slots } = useTrainerContext();

  return (
    <WholeSection>
      <PokeGrid>
        {slots.map((slotId, index) => (
          <PokemonCard
            key={slotId}
            pokemon={lineUp[index]}
            id={slotId}
            lineUpPos={index}
          />
        ))}
      </PokeGrid>
      <LineupBar reorderable={true} />
    </WholeSection>
  );
}

//---------------------------------------------------
function PokeGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-20 w-full grid grid-cols-3 grid-row-2 gap-4 gap-y-4 grid-template-rows-[auto_auto_auto] mb-1 ">
      {children}
    </div>
  );
}

function WholeSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full h-full flex flex-col items-center my-3">
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
  const { lineUp, handleBallClick, ballEdit } = useTrainerContext();
  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="h-45 relative flex flex-col items-center gap-0"
      onClick={() => handleBallClick?.(lineUpPos)}
    >
      <PkCardImage pokemon={pokemon} highlighted={ballEdit === lineUpPos} />
      {pokemon && <PKCardDetails pokemon={pokemon} />}
    </motion.div>
  );
}

//Optional Image and Compulsory BackBubble
export function PkCardImage({
  pokemon,
  highlighted,
}: {
  pokemon?: TPokemon;
  highlighted: boolean;
}) {
  const { isReordering, ballShiftMode } = useTrainerContext();
  // If no data, return empty bubble
  if (!pokemon)
    return (
      <div className="noSelect relative w-20 h-20 md:w-25 md:h-25 lg:w-35 lg:h-35">
        <div className="noSelect z-5 absolute -top-2 -left-6 "></div>
        <BackBubble editing={isReordering} />
      </div>
    );
  // If data, return populated entry

  const spriteAnimationControls = useAnimation();
  // const [isShaking, setIsShaking] = useState(false);
  const handleAnimateShake = () => {
    spriteAnimationControls.set({ x: 0 });
    spriteAnimationControls.start({
      x: [-7, 7, -7],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 0.5,
      },
    });
  };
  const handleAnimateShakeStop = () => {
    spriteAnimationControls.start({
      x: 0,
      transition: { duration: 0, ease: "linear" },
    });
  };
  useEffect(() => {
    if (ballShiftMode === "shift" && !highlighted) {
      // setIsShaking(true);
      handleAnimateShake();
    } else {
      // setIsShaking(false);
      handleAnimateShakeStop();
    }
  }, [isReordering, ballShiftMode, highlighted]);
  return (
    <div
      className={` noSelect transition-all duration-300 relative w-20 h-20 md:w-25 md:h-25 lg:w-35 lg:h-35`}
    >
      <div className="noSelect z-5 absolute -top-2 -right-6 ">
        <PKCardTypes types={pokemon.type} />
      </div>
      <div className="noSelect z-5 absolute -top-2 -left-6 "></div>

      <motion.img
        // style={{ transform: "translateX(0px)" }}
        // initial={{ translateX: 0 }}

        animate={spriteAnimationControls}
        src={pokemon.sprite}
        alt={pokemon.name}
        className={`${
          highlighted ? "scale-120" : "scale-105"
        } transform-gpu w-full h-full transition-scale duration-300  object-cover absolute z-3 user-select-none pixelImage pointer-events-none`}
      />
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

//Exp
function ExpBubble({ exp, types }: { exp: number; types: Element[] }) {
  return (
    <div className="noSelect z-5 absolute -top-2 -left-6 ">
      {/* <div className="Font-secondary bg-white text-[8pt] px-[4px] py-[0px] border-2 rounded-sm">
        exp. {exp}
      </div> */}
      <PKCardTypes types={types} />
    </div>
  );
}

function BackBubble({ editing = false }: { editing?: boolean }) {
  return (
    <div
      className={`transition-all duration-400 absolute m-1 noSelect inset-0 z-1  rounded-full ${
        editing ? "bg-gray-300 " : "bg-gray-200"
      }`}
    />
  );
}
