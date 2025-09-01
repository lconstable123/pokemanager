import React from "react";

type WindowBgProps = {
  image: "Snorlax" | "Charizard" | "Pikachu";
};

export default function WindowBg({ image }: WindowBgProps) {
  const getImageSrc = (image: "Snorlax" | "Charizard" | "Pikachu") => {
    switch (image) {
      case "Snorlax":
        return "/08 - Snorlax.svg";
      case "Charizard":
        return "/06 - Charizard.svg";
      case "Pikachu":
        return "/1 - Pikachu.svg";
    }
  };

  return (
    <img
      src={getImageSrc(image)}
      width={6000}
      height={300}
      className="z-1 absolute sm:-translate-x-50 -translate-x-10 md:translate-y-20 opacity-[3%] scale-[150%] md:scale-100 pointer-events-none"
      alt="Logo"
    />
  );
}
