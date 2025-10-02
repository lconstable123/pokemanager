import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Element } from "./types";

import { parseBall, TBallSchema } from "./schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getTrainerSprite(avatar: number) {
  switch (avatar) {
    case 0:
      return "/trainers/oak.png";
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
      return "/trainers/trainer_1.png";
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
  element = element.toLowerCase() as Element;
  switch (element) {
    case "fire":
      return "/elements/fire.svg";
    case "water":
      return "/elements/water.svg";
    case "grass":
      return "/elements/grass.svg";
    case "electric":
      return "/elements/electric.svg";
    case "ice":
      return "/elements/ice.svg";
    case "fighting":
      return "/elements/fighting.svg";
    case "poison":
      return "/elements/poison.svg";
    case "ground":
      return "/elements/ground.svg";
    case "flying":
      return "/elements/flying.svg";
    case "psychic":
      return "/elements/psychic.svg";
    case "bug":
      return "/elements/bug.svg";
    case "rock":
      return "/elements/rock.svg";
    case "ghost":
      return "/elements/ghost.svg";
    case "dragon":
      return "/elements/dragon.svg";
    case "dark":
      return "/elements/dark.svg";
    case "steel":
      return "/elements/steel.svg";
    case "fairy":
      return "/elements/fairy.svg";
    case "normal":
      return "/elements/normal.svg";
    default:
      return "";
  }
}

export const generateRandomBall = (): TBallSchema => {
  const seed = Date.now();
  const balls = ["01", "02", "03", "04", "05", "06", "07", "08", "09"];
  const randomValue = (seed % 9) / 9;
  const randomBall = balls[Math.floor(Math.random() * balls.length)];
  const validateBall = parseBall(randomBall);
  if (!validateBall) return "02" as TBallSchema; // default to pokeball if invalid
  return validateBall;
};

export const generateRandomName = () => {
  const names = [
    "Sparky",
    "Flame",
    "Aqua",
    "Terra",
    "Bolt",
    "Shadow",
    "Blaze",
    "Frost",
    "Rocky",
    "Leafy",
    "Storm",
    "Ember",
    "Wave",
    "Glacier",
    "Thunder",
    "Cinder",
    "Breeze",
    "Nova",
    "Echo",
    "Zephyr",
    "Luna",
    "Sol",
    "Comet",
    "Nimbus",
    "Aurora",
    "Vortex",
    "Blizzard",
    "Inferno",
    "Cascade",
    "Hurricane",
    "Tornado",
    "Quake",
    "Fang",
    "Claw",
    "Pounce",
    "Roar",
    "Whisker",
    "Tailspin",
    "Snarl",
    "Gale",
    "Drift",
    "Flash",
    "Glint",
    "Shimmer",
    "Twilight",
    "Dusk",
    "Dawn",
  ];
  return names[Math.floor(Math.random() * names.length)];
};

export const generateRandomTrainer = () => {
  const names = ["Ash", "Misty", "Brock", "Red", "Gary", "Jessie", "James"];
  const randomTrainer = names[Math.floor(Math.random() * names.length)];
  const randomEmail =
    randomTrainer.toLowerCase() +
    Math.floor(Math.random() * 1000).toString() +
    "@example.com";
  const randomPassword = generatePassword();
  return { randomTrainer, randomEmail, randomPassword };
};

function generatePassword(length = 6) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}
