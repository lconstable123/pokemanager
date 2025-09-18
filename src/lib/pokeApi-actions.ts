import { ApiPkData } from "./types";

export const FetchPkDetails = async (
  P: any,
  pkname: string,
  detail: "imgFront" | "imgBack" | "elements" | "baseXp"
): Promise<string | string[] | number | null> => {
  if (!pkname) return null;
  // setLoadingImage(true);
  try {
    const response: ApiPkData = await P.getPokemonByName(pkname);
    if (detail === "imgFront") {
      return response.sprites.front_default || "";
    }
    if (detail === "imgBack") {
      return response.sprites.back_default || "";
    }
    if (detail === "elements") {
      return response.types.map((type) => type.type.name) || null;
    }

    return null;
  } catch (error) {
    throw new Error(
      (error as Error).message || "Unknown error fetching pk data"
    );
  }
};
