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
  apiId: string;
  ball: string;
  name: string;
  species: string;
  type: Element[];
  level: number;
  exp: number;
  sprite: string;
};

export type Element =
  | "Ice"
  | "Fire"
  | "Water"
  | "Grass"
  | "Electric"
  | "Psychic"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Poison"
  | "Bug"
  | "Steel"
  | "Fairy"
  | "Normal"
  | "Ground"
  | "Fighting"
  | "Flying"
  | "Dark";
