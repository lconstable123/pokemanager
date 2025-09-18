// "use client";

// import { useState } from "react";
// import { RomanToInt } from "./utils";

// const useSearchFilter = () => {
//   const fetchPkByGeneration = async (
//     generations: string[]
//   ): Promise<string[]> => {
//     const [generationFilter, setGenerationFilter] = useState<string[]>([]);
//     const [genFilteredEntries, setGenFilteredEntries] = useState<string[]>([]);
//     try {
//       //prep data
//       const gensAsNumber = generationFilter.map((gen) => RomanToInt(gen));
//       //fetch by gen
//       const response = await P.getGeneration(gensAsNumber);
//       const allPk = response.map((gen: any) => gen.pokemon_species);
//       const allPknames = allPk.map((pkGen: any) =>
//         pkGen.map((pk: any) => pk.name)
//       );

//       return allPknames.flat();
//     } catch (error) {
//       console.error("Error fetching generation data:", error);
//       return [];
//     }
//   };

//   const PaginatedPkFetcher = async (page: number, limit: number) => {

//     let TempAllFilteredPks: string[] = [];
//     try {
//       if (generationFilter.length === 0) {
//         // toast.success(`Fetching, unfiltered...`);
//         TempAllFilteredPks = await fetchAllPK(page, limit);
//       } else {
//         // toast.success(`Fetching, filtered...by ${generationFilter}`);
//         TempAllFilteredPks = await PaginatedFilter(
//           PkDropdownPage,
//           PkDropdownAmt,
//           genFilteredEntries
//         );
//         // console.log("fetched filtered pks: ", TempAllFilteredPks);
//       }
//       setPkDropdownEntries(TempAllFilteredPks);
//       checkListingEnd(limit, TempAllFilteredPks);
//     } catch (err) {
//       if (!isDexFetchCancelled) {
//         setDexError((err as Error).message || "Unknown error");
//       }
//     } finally {
//       if (!isDexFetchCancelled) {
//         setDexLoading(false);
//       }
//     }
//   };

//   const handleFetchbyGeneration = async () => {
//     const genResults = await fetchPkByGeneration(generationFilter);
//     setGenFilteredEntries(genResults);
//     console.log("fetched gen results: ", genResults);
//   };
// };
