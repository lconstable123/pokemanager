import { Infer } from "zod";
import { balloptions, dummyPkData, elmOptions } from "./data";
import { Pokemon, Prisma } from "@/generated/prisma";
// import { Pokemon, Prisma } from "@/generated/prisma";
export type TTrainer = {
  id: string;
  name: string;
  email: string;
  avatar: number;
  lineup: TLineUp;
};

export type TLineUp = TPokemon[];
// export type TPokemon2 = typeof Prisma.pokemon;
// export type TTrainer2 = typeof Prisma.trainer;
export type TPokemon = {
  id: string;
  ball: string;
  name: string;
  species: string;
  type: Element[];
  exp: number;
  sprite: string;
};

export type Element = (typeof elmOptions)[number];
export type TBallOption = (typeof balloptions)[number];
export type ApiPkData = typeof dummyPkData;
export type TServerPK = Omit<Pokemon, "createdAt" | "updatedAt">;
export type ServerTrainerWithLineup = Prisma.TrainerGetPayload<{
  include: { lineup: true };
}>;
