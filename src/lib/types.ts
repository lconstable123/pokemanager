import { balloptions, dummyPkData, elmOptions } from "./data";

export type TTrainer = {
  id: string;
  name: string;
  email: string;
  age: number;
  avatar: number;
  lineup: TLineUp;
};

export type TLineUp = TPokemon[];

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
