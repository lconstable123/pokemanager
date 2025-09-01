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
      className="absolute -translate-x-50 translate-y-20 opacity-[3%]  pointer-events-none"
      alt="Logo"
    />
  );
}
