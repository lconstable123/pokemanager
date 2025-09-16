"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useIsMobile } from "../hooks";
import toast from "react-hot-toast";
import { TPokemon } from "../types";
import { set } from "zod";
import { clear } from "console";
import { RomanToInt } from "../utils";

type AppContextType = {
  isMobile: boolean;
  isSmall: boolean;
  disableScroll: (time?: number) => void;
  AddPkModalopen: boolean;
  setAddPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  EditPkModalopen: boolean;
  setEditPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPk: TPokemon | null;
  setSelectedPk: React.Dispatch<React.SetStateAction<TPokemon | null>>;
  handleSelectPk: (pokemon: TPokemon) => void;
  PkDropdownPage: number;
  handlePkPageNext: () => void;
  handlePkPagePrev: () => void;
  generationFilter: string[];
  setGenerationFilter: React.Dispatch<React.SetStateAction<string[]>>;
  typeFilter: string[];
  setTypeFilter: React.Dispatch<React.SetStateAction<string[]>>;
  maxPkDropdownPages: number;
  PkDropdownEntries: string[];
  setPkDropdownEntries: React.Dispatch<React.SetStateAction<string[]>>;
  PkDropdownAmt: number;
};

export const PokeAppContext = createContext<AppContextType | null>(null);

export default function PokeAppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const Pokedex = require("pokeapi-js-wrapper");
  const P = new Pokedex.Pokedex();
  const { isMobile, isSmall } = useIsMobile(); // default 640px breakpoint
  const [AddPkModalopen, setAddPkModalOpen] = useState(false);
  const [EditPkModalopen, setEditPkModalOpen] = useState(false);
  const [selectedPk, setSelectedPk] = useState<TPokemon | null>(null);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const EntriesPerPage = 9;
  const [PkDropdownPage, setPkDropdownPage] = useState(3);
  const [PkDropdownEntries, setPkDropdownEntries] = useState<string[]>([]);
  const PkDropdownAmt = PkDropdownEntries.length;
  const maxPkDropdownPages = Math.ceil(PkDropdownAmt / EntriesPerPage);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [generationFilter, setGenerationFilter] = useState<string[]>([]);
  const handleSelectPk = (pokemon: TPokemon) => {
    if (selectedPk && EditPkModalopen) {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
      toast.error("modeal is already open.");
      setAddPkModalOpen(false);
      setSelectedPk(pokemon);
      modalTimerRef.current = setTimeout(() => {
        setAddPkModalOpen(true);
        toast.success("Switched to new Pokémon.");
      }, 1000);
      return;
    } else if (pokemon) {
      toast.success("opening edit window with " + pokemon.name);
      setSelectedPk(pokemon);
      setEditPkModalOpen(true);
    }
  };

  const handlePkPageNext = () => {
    toast.success("next page");
    setPkDropdownPage((prev) => prev + 1);
    // toast("page " + (PkDropdownPage + 2) + " of " + maxPkDropdownPages);
  };
  const handlePkPagePrev = () => {
    setPkDropdownPage((prev) => Math.max(0, prev - 1));
    // toast.success("prev page " + PkDropdownPage);
  };

  const disableScroll = (time = 500) => {
    const scrollContainer = (document.scrollingElement ||
      document.documentElement) as HTMLElement;

    // Temporarily disable smooth scrolling to prevent auto-scroll during animation

    scrollContainer.style.scrollBehavior = "auto";
    scrollContainer.style.overflow = "hidden";

    // Optionally restore it after animation (e.g. after 500ms)
    setTimeout(() => {
      scrollContainer.style.overflow = "auto";
      scrollContainer.style.scrollBehavior = "smooth";
    }, time);
  };
  //--------------------pokeapi calls

  const fetchAllPK = async (
    page: number,
    limit: number,
    elmFilter: string[] = ["Fire"],
    genFilter: number[] = [1]
  ) => {
    const interval = {
      offset: (page - 1) * limit,
      limit: limit,
    };
    P.getPokemonsList(interval).then(async function (response) {
      console.log(response);
      const pokeList = response.results.map((pk: any) => pk.name);
      // const filteredList = await filterPk(pokeList, elmFilter, genFilter);
      setPkDropdownEntries(pokeList);
      toast.success(`Fetched ${pokeList.length} pokemon`);
      console.log(pokeList);
    });
  };

  // const filterPk = async (
  //   pokeList: string[],
  //   elmFilter: string[],
  //   genFilter: number[]
  // ) => {
  //   return pokeList.filter((pk) => {
  //     const isInElementType = elmFilter.length === 0 || elmFilter.includes(pk);
  //     const isInGeneration =
  //       genFilter.length === 0 || genFilter.includes(getPokemonGeneration(pk));
  //     return isInElementType && isInGeneration;
  //   });
  // };

  const fetchPkByGeneration = async (generations: number[]) => {
    P.getGeneration(generations).then(function (response) {
      // toast.success(response.name);
      const allPk = response.map((gen: any) => gen.pokemon_species);
      const allPknames = allPk.map((pkGen: any) =>
        pkGen.map((pk: any) => pk.name)
      );
      const Pkflattened = allPknames.flat();
      console.log(Pkflattened);
    });
  };
  const fetchPkByType = async (types: string[]) => {
    P.getTypeByName(types).then(function (response) {
      // toast.success(response.name);
      const allPk = response.map((gen: any) => gen.pokemon);
      console.log(allPk);
      // const allPknames = allPk.map((pkGen: any) =>
      //   pkGen.map((pk: any) => pk.name)
      // );
      // const Pkflattened = allPknames.flat();
      // console.log(Pkflattened);
    });
  };

  useEffect(() => {
    fetchAllPK(PkDropdownPage + 1, 15);
  }, [PkDropdownPage]);

  // useEffect(() => {
  //   P.
  // },[])

  useEffect(() => {
    const gensAsNumber = generationFilter.map((gen) => RomanToInt(gen));
    fetchPkByGeneration(gensAsNumber);
  }, [generationFilter]);

  useEffect(() => {
    const types = typeFilter.map((type) => type.toLowerCase());
    fetchPkByType(types);
  }, [typeFilter]);
  //cleanup on unmount

  return (
    <PokeAppContext.Provider
      value={{
        isMobile,
        isSmall,
        disableScroll,
        AddPkModalopen,
        setAddPkModalOpen,
        EditPkModalopen,
        setEditPkModalOpen,
        selectedPk,
        setSelectedPk,
        handleSelectPk,
        handlePkPageNext,
        handlePkPagePrev,
        PkDropdownPage,
        maxPkDropdownPages,
        PkDropdownEntries,
        setPkDropdownEntries,
        PkDropdownAmt,
        generationFilter,
        setGenerationFilter,
        typeFilter,
        setTypeFilter,
      }}
    >
      {children}
    </PokeAppContext.Provider>
  );
}

export function usePokeAppContext() {
  const context = useContext(PokeAppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppContextProvider");
  return context;
}
