"use client";

import { useEffect, useState } from "react";
import { FetchPkDetails } from "./pokeApi-actions";
import toast from "react-hot-toast";
import { usePreloadImage } from "./hooks";
import { usePokeAppContext } from "./contexts/PokeAppContext";
import { Element } from "./types";
import { useDexContext } from "./contexts/DexContext";

export const UseFetchPkImg = (selectedDexPk: any) => {
  const { P } = useDexContext();
  const [DexPrevImg, setSelectedDexPrevImg] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [elements, setElements] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingImage(false);

      try {
        console.log("Fetching details for: ", selectedDexPk);
        const imgFront = await FetchPkDetails(P, selectedDexPk!, "imgFront");
        const elements: string[] = await FetchPkDetails(
          P,
          selectedDexPk!,
          "elements"
        );

        if (imgFront) {
          //   toast.success("Fetched image: " + imgFront);
          console.log("fetched imgFront: ", imgFront);
          setSelectedDexPrevImg(imgFront as string);
        } else {
          toast.error("Image not found");
        }
        if (elements) {
          //   toast.success("Fetched image: " + imgFront);
          setElements(elements);
          console.log("fetched elements: ", elements);
        } else {
          toast.error("elements not found");
        }
      } catch (error) {
        toast.error("Failed to fetch Pokémon details.");
        console.error(error);
      } finally {
      }
    };

    if (selectedDexPk) {
      fetchData();
    } else {
      setSelectedDexPrevImg(null);
      setElements([]);
      setLoadingImage(false);
    }
  }, [selectedDexPk]);

  usePreloadImage(DexPrevImg, setLoadingImage);

  return { loadingImage, DexPrevImg, elements };
};
