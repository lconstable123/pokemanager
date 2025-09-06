"use client";

import { useIsMobile } from "@/lib/hooks";

import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import { Element, TPokemon } from "@/lib/types";
const features = [
  "Full Stack with Next",
  "Optimistic Frontend",
  "Next-Auth",
  "Prisma and Postgres",
];

export default function Home() {
  const { isMobile, isSmall } = useIsMobile();
  const { lineUp, trainer } = useTrainerContext();
  return (
    <WholeSection>
      <PokeGrid>
        {lineUp.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </PokeGrid>
      <nav className="w-100 h-15 rounded-full bg-amber-300"></nav>
    </WholeSection>
  );
}

//---------------------------------------------------
function PokeGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 grid-template-rows-[auto_auto] mb-5 ">
      {children}
    </div>
  );
}

function WholeSection({ children }: { children: React.ReactNode }) {
  return (
    <section className=" w-full h-full flex flex-col items-center  my-3">
      {children}
    </section>
  );
}

export function PokemonCard({ pokemon }: { pokemon: TPokemon }) {
  return (
    <div key={pokemon.id} className="relative flex flex-row items-center gap-1">
      <div className="noSelect z-5 Font-secondary bg-white text-[8pt] px-[4px] py-[0px] absolute -top-2 -left-6 border-2 rounded-sm">
        exp. 35
      </div>
      <PkCardImage sprite={pokemon.sprite} />
      <PKCardDetails pokemon={pokemon} />
    </div>
  );
}

export function PkCardImage({ sprite }: { sprite: string }) {
  return (
    <div className="noSelect relative w-35 h-35">
      <img
        src={sprite}
        alt={sprite}
        className="w-full h-full object-cover absolute z-3 user-select-none pixelImage pointer-events-none"
      />
      <div className="absolute  noSelect inset-0 mx-4 my-4 z-1 bg-gray-200 rounded-full" />
    </div>
  );
}

export function PKCardDetails({ pokemon }: { pokemon: TPokemon }) {
  return (
    <div className="noSelect text-center text-md leading-tight tracking-wider! ">
      <h3 className="text-md font-bold">{pokemon.name}</h3>
      <hr className="border-1 mb-[2px]" />
      <p className="secondary-p-styling mb-1">{pokemon.species}</p>
      <PKCardTypes types={pokemon.type} />
    </div>
  );
}

function PKCardTypes({ types }: { types: Element[] }) {
  return (
    <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
      {types.map((type) => (
        <span
          key={type}
          className="px-2 rounded-full text-xs font-semibold uppercase tracking-widest"
        >
          <p className="font-sans text-[8pt] tracking-widest">{type}</p>
        </span>
      ))}
    </div>
  );
}
