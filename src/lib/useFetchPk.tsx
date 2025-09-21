"use client";
import { useEffect, useState } from "react";
import { RomanToInt } from "./utils";
import toast from "react-hot-toast";

export const UseFetchPk = (P: any) => {
  const [dexloading, setDexLoading] = useState(false);
  const [dexError, setDexError] = useState<string | null>(null);
  const [isDexFetchCancelled, setIsDexFetchCancelled] = useState(false);
  const EntriesPerPage = 24;
  const [PkDropdownPage, setPkDropdownPage] = useState(1);
  const [PkDropdownEntries, setPkDropdownEntries] = useState<string[]>([]);
  const PkDropdownAmt = PkDropdownEntries.length;
  const maxPkDropdownPages = Math.ceil(PkDropdownAmt / EntriesPerPage);
  const [generationFilter, setGenerationFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [lastpage, setLastPage] = useState(false);

  //-------------------------handlers
  const handleSetGenrationFilter = (gens: string[]) => {
    setGenerationFilter(gens);
    setPkDropdownPage(1); //reset page to 1 when filter changes
  };
  const handlePkPageNext = () => {
    if (!lastpage) {
      setPkDropdownPage((prev) => prev + 1);
    }
  };
  const handlePkPagePrev = () => {
    setPkDropdownPage((prev) => Math.max(1, prev - 1));
  };

  const fetchAllPK = async (page: number, limit: number): Promise<string[]> => {
    const gensAsNumber = generationFilter.map((gen) => RomanToInt(gen))[0];
    const genOffset = sliceByGen(gensAsNumber)[0] - 1;
    toast.success(`Fetching ${genOffset} onwards`);
    const interval = {
      offset: (page - 1) * limit + genOffset,
      limit: limit,
    };
    const response = await P.getPokemonsList(interval);
    const pokeList = await response.results.map((pk: any) => pk.name);
    setPkDropdownEntries(pokeList);
    return pokeList;
  };

  const PaginatedPkFetcher = async (page: number, limit: number) => {
    setDexLoading(true);
    setDexError(null);
    let TempAllFilteredPks: string[] = [];
    try {
      TempAllFilteredPks = await fetchAllPK(page, limit);
      setPkDropdownEntries(TempAllFilteredPks);
      checkListingEnd(limit, TempAllFilteredPks);
    } catch (err) {
      if (!isDexFetchCancelled) {
        setDexError((err as Error).message || "Unknown error");
      }
    } finally {
      if (!isDexFetchCancelled) {
        setDexLoading(false);
      }
    }
  };

  //-------------------------filter effects
  useEffect(() => {
    toast.success(`Generation filter changed: ${generationFilter}`);
    PaginatedPkFetcher(PkDropdownPage, EntriesPerPage);
  }, [PkDropdownPage, generationFilter]);
  //-------------------------initial fetch

  useEffect(() => {
    setDexLoading(true);
    setDexError(null);
    PaginatedPkFetcher(PkDropdownPage, EntriesPerPage);
    return () => {
      setIsDexFetchCancelled(true);
    };
  }, []);
  //-------------------------helper functions

  const sliceByGen = (gen: number) => {
    const genRanges: { [key: number]: [number, number] } = {
      1: [1, 151],
      2: [152, 251],
      3: [252, 386],
      4: [387, 493],
      5: [494, 649],
      6: [650, 721],
      7: [722, 809],
      8: [810, 898],
      9: [899, 1010],
    };

    return genRanges[gen] || [1, 151];
  };

  const checkListingEnd = (limit: number, arr: any[]) => {
    if (arr.length < limit) {
      setLastPage(true);
    } else {
      setLastPage(false);
    }
  };

  return {
    handlePkPageNext,
    handlePkPagePrev,
    PkDropdownPage,
    maxPkDropdownPages,
    PkDropdownEntries,
    setPkDropdownEntries,
    PkDropdownAmt,
    generationFilter,
    handleSetGenrationFilter,
    typeFilter,
    setTypeFilter,
    dexloading,
  };
};

// const fetchPkByGeneration = async (
//   generations: string[]
// ): Promise<string[]> => {
//   try {
//     //prep data
//     const gensAsNumber = generationFilter.map((gen) => RomanToInt(gen));
//     //fetch by gen
//     const response = await P.getGeneration(gensAsNumber);
//     const allPk = response.map((gen: any) => gen.pokemon_species);
//     const allPknames = allPk.map((pkGen: any) =>
//       pkGen.map((pk: any) => pk.name)
//     );

//     return allPknames.flat();
//   } catch (error) {
//     console.error("Error fetching generation data:", error);
//     return [];
//   }
// };
