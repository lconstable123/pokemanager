"use client";
import { FaPlus } from "react-icons/fa";
import { useIsMobile } from "@/lib/hooks";
import { motion, useAnimation } from "framer-motion";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import { Element, TPokemon } from "@/lib/types";
import { cn, getElementSprite } from "@/lib/utils";
import { useEffect } from "react";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { toast } from "react-hot-toast";
import { useMultipleImageLoader } from "@/lib/useImageLoader";
import LineupBar from "../../../../components/lineup-bar";

import Portal from "../../../../components/lineup-portal";
export default function Home() {
  const { setPsyduckServer } = usePokeAppContext();
  const { slots, isReordering, uiLineup } = useTrainerContext();
  const { isMobile } = useIsMobile();
  const lineUpUrls = [
    ...uiLineup?.map((pk) => pk?.sprite),
    ...uiLineup?.map((pk) => pk?.spriteBack),
    "/pokebg_3.png",
  ];
  const frontImages = uiLineup.map((pk) => ({
    sprite: pk?.spriteBack,
    id: pk.id,
  }));
  const allImagesLoaded = useMultipleImageLoader(lineUpUrls);
  useEffect(() => {
    setPsyduckServer(true);
  }, []);

  return (
    <>
      {isMobile && <LineupBar reorderable={true} isMobile={isMobile} />}

      <WholeSection>
        {!isMobile && <FrontLineUpPortal lineUp={frontImages} />}
        {allImagesLoaded && (
          <PokeGrid>
            {slots.map((slot, index) => (
              <div key={slot.id} className="relative">
                <GridNumber
                  index={index}
                  isReordering={isReordering}
                  status={slot.empty}
                />
                <PokemonCard
                  pokemon={
                    slot.empty ? undefined : (uiLineup[index] as TPokemon)
                  }
                  id={uiLineup[index]?.id || slot.id}
                  lineUpPos={index}
                />
              </div>
            ))}
          </PokeGrid>
        )}
      </WholeSection>
      {!isMobile && <LineupBar reorderable={true} isMobile={isMobile} />}
    </>
  );
}

//---------------------------------------------------
function PokeGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className=" pt-2 z-0 px-0 sm:px-7 lg:px-20  rounded-3xl w-85 sm:w-full sm:h-full grid grid-cols-2 grid-rows-3 sm:grid-cols-3 sm:grid-row-2  gap-x-1 gap-y-1 sm:gap-y-4  mb-1 ">
      {children}
    </div>
  );
}

function FrontLineUpPortal({
  lineUp,
}: {
  lineUp: { sprite?: string; id: string }[];
}) {
  const { windowWidth, pageAnimControls } = usePokeAppContext();
  const spacing = windowWidth / 6; // prevent divide by 0
  return (
    <Portal>
      <motion.div
        animate={pageAnimControls}
        className="absolute bottom-0 w-screen h-50 z-30"
      >
        <div className="">
          {/* {!isMobile && (
            <div className="absolute w-full -bottom-0 h-20 bg-gradient-to-t from-yellow-300/30 to-yellow-500/0 z-30" />
          )} */}
          {lineUp.map((pk, index) => (
            <motion.div
              animate={{ x: index * spacing }}
              key={pk.id}
              className={`absolute z-100 w-[100px] sm:w-[200px] h-[100px]sm:h-[200px] `}
            >
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.2 }}
                width={200}
                height={200}
                src={pk.sprite}
                alt={pk.id}
                className="-rotate-12 translate-y-35 sm:translate-y-20 -translate-x-20  scale-130 pixelImage hardSVGShadow"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Portal>
  );
}

function GridNumber({
  index,
  isReordering,
  status,
}: {
  index: number;
  isReordering?: boolean;
  status: boolean;
}) {
  return (
    <div
      className={`${
        isReordering ? (!status ? "opacity-100" : "opacity-20") : "opacity-0"
      } transition-opacity duration-500 noSelect z-1 absolute  -top-4 sm:-top-2 left-2 sm:left-2 md:left-0  lg:left-0 2xl:left-10 border-2 font-black border-yellow-300 text-yellow-700 text-sm p-4 w-4 h-4 rounded-full flex items-center justify-center bg-yellow-100`}
    >
      {index + 1}
      {/* {status} */}
    </div>
  );
}

function WholeSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-[660px]  z-4 relative mb-0 sm:mb-3 mt-6 sm:mt-5 flex justify-center ">
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
  const { handleBallClick, ballEdit, slots } = useTrainerContext();
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
      layout="preserve-aspect"
      key={id}
      id={id}
      layoutScroll
      custom={lineUpPos}
      initial={{ opacity: 0 }}
      animate={cardAnimationControls}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="h-45 z-3 relative flex flex-col items-center gap-0"
      onClick={() => handleBallClick?.(lineUpPos)}
    >
      {/* <span className="text-[8pt] text-red-400">{id}</span> */}
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
  const { isReordering, slots } = useTrainerContext();

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
      <div className=" scale-80 sm:scale-100 noSelect relative  w-35 h-35">
        {/* <div className="noSelect z-5 absolute -top-2 -left-6 "></div> */}
        <AddBubble />
      </div>
    );
  // If data, return populated entry

  return (
    <div className={`scale-80 sm:scale-100 noSelect relative  w-35 h-35`}>
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
          className={cn(
            "transition-all w-full h-full cursor-pointer absolute z-3 user-select-none pixelImage",
            !isReordering
              ? "scale-110 hover:scale-130"
              : highlighted
              ? " scale-145 hover:scale-150"
              : "scale-130 hover:scale-140"
          )}
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
          lvl {pokemon.exp}
        </span>
        {" " + pokemon.species}
      </p>
    </div>
  );
}

// TypeBubbles
function PKCardTypes({ types }: { types: Element[] }) {
  return (
    <div className="mr-2 -translate-y-3 sm:-translate-y-0 sm:mr-0 mt-1 flex flex-row sm:flex-col gap-0 ">
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
      className={` transition-all outline-3 bg3 outline-gray-200 duration-700  absolute m-1 noSelect inset-0 z-1  rounded-full ${
        editing ? " scale-70  opacity-40 " : "  scale-100 opacity-100"
      }`}
    />
  );
}

function AddBubble() {
  const { setAddPkModalOpen } = usePokeAppContext();
  const { isReordering } = useTrainerContext();

  return (
    <div
      onClick={() => {
        if (isReordering) {
          toast.error("Finish reordering before adding a Pokémon");
          return;
        } else {
          setAddPkModalOpen(true);
        }
        // toast.success("Opening add Pokémon modal");
      }}
      className={cn(
        " transition-all  hover:bg-gray-100 bg-white duration-700  absolute noSelect inset-0 flex justify-center items-center z-1 border-4 border-gray-200  rounded-full",
        isReordering
          ? "opacity-30 pointer-events-none"
          : "cursor-pointer opacity-100"
      )}
    >
      <FaPlus className="m-auto w-7 h-7 text-gray-400" />
    </div>
  );
}
