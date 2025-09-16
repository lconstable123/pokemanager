import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Element } from "./types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getTrainerSprite(avatar: number) {
  switch (avatar) {
    case 1:
      return "/trainers/trainer_1.png";
    case 2:
      return "/trainers/trainer_2.png";
    case 3:
      return "/trainers/trainer_3.png";
    case 4:
      return "/trainers/trainer_4.png";
    case 5:
      return "/trainers/trainer_5.png";
    case 6:
      return "/trainers/trainer_6.png";
    case 7:
      return "/trainers/trainer_7.png";
    case 8:
      return "/trainers/trainer_8.png";
    default:
      return "/trainers/trainer_0.png";
  }
}

export function RomanToInt(s: string): number {
  switch (s.toLowerCase()) {
    case "i":
      return 1;
    case "ii":
      return 2;
    case "iii":
      return 3;
    case "iv":
      return 4;
    case "v":
      return 5;
    case "vi":
      return 6;
    case "vii":
      return 7;
    case "viii":
      return 8;
    case "ix":
      return 9;
    case "x":
      return 10;
    case "xi":
      return 11;
    case "xii":
      return 12;
    case "xiii":
      return 13;
    default:
      return 0;
  }
}

export function getElementSprite(element: Element) {
  switch (element) {
    case "Fire":
      return "/elements/fire.svg";
    case "Water":
      return "/elements/water.svg";
    case "Grass":
      return "/elements/grass.svg";
    case "Electric":
      return "/elements/electric.svg";
    case "Ice":
      return "/elements/ice.svg";
    case "Fighting":
      return "/elements/fighting.svg";
    case "Poison":
      return "/elements/poison.svg";
    case "Ground":
      return "/elements/ground.svg";
    case "Flying":
      return "/elements/flying.svg";
    case "Psychic":
      return "/elements/psychic.svg";
    case "Bug":
      return "/elements/bug.svg";
    case "Rock":
      return "/elements/rock.svg";
    case "Ghost":
      return "/elements/ghost.svg";
    case "Dragon":
      return "/elements/dragon.svg";
    case "Dark":
      return "/elements/dark.svg";
    case "Steel":
      return "/elements/steel.svg";
    case "Fairy":
      return "/elements/fairy.svg";
    case "Normal":
      return "/elements/normal.svg";
    default:
      return "";
  }
}
