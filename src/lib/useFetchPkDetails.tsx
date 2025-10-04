"use client";

import { useEffect, useState } from "react";
import { FetchPkDetails } from "./pokeApi-actions";
import { usePreloadImage } from "./hooks";
import { usePokeAppContext } from "./contexts/PokeAppContext";
import { useDexContext } from "./contexts/DexContext";
import { set } from "zod";
import { useMultipleImageLoader } from "./useImageLoader";
export const UseFetchPkImg = (selectedDexPk: any, P: any) => {
  // const { P } = useDexContext();
  const [DexPrevImg, setSelectedDexPrevImg] = useState<string | null>(null);
  const [DexPrevBackImg, setSelectedDexPrevBackImg] = useState<string | null>(
    null
  );
  const [loadingImage, setLoadingImage] = useState(false);
  const [elements, setElements] = useState<string[]>([]);
  const { isInspectingLineup } = usePokeAppContext();

  const handleImageReset = () => {
    // console.log("Resetting image and elements.");
    // toast.success("Resetting image and elements.");
    setSelectedDexPrevImg(null);
    setSelectedDexPrevBackImg(null);
    setElements([]);
    setLoadingImage(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoadingImage(false);
      // toast.success("Fetching server details for: " + selectedDexPk);
      try {
        console.log("Fetching details for: ", selectedDexPk);
        const imgFront = await FetchPkDetails(P, selectedDexPk!, "imgFront");
        const imgBack = await FetchPkDetails(P, selectedDexPk!, "imgBack");
        const elements = (await FetchPkDetails(
          P,
          selectedDexPk!,
          "elements"
        )) as string[];

        if (imgFront) {
          //   toast.success("Fetched image: " + imgFront);
          console.log("fetched imgFront: ", imgFront);
          setSelectedDexPrevImg(imgFront as string);
        }
        if (imgBack) {
          console.log("fetched imgBack: ", imgBack);
          setSelectedDexPrevBackImg(imgBack as string);
        }
        if (elements) {
          //   toast.success("Fetched image: " + imgFront);
          setElements(elements);
          console.log("fetched elements: ", elements);
        }
      } catch (error) {
        // toast.error("Failed to fetch Pokémon details.");
        console.error(error);
      } finally {
      }
    };

    if (selectedDexPk && !isInspectingLineup) {
      fetchData();
    } else {
      setSelectedDexPrevImg(null);
      setSelectedDexPrevBackImg(null);
      setElements([]);
      setLoadingImage(false);
    }
  }, [selectedDexPk]);

  usePreloadImage(DexPrevImg, setLoadingImage);
  const loading = useMultipleImageLoader([DexPrevImg, DexPrevBackImg]);

  useEffect(() => {
    setLoadingImage(loading);
  }, [loading]);

  return {
    loadingImage,
    DexPrevImg,
    DexPrevBackImg,
    elements,
    handleImageReset,
  };
};
