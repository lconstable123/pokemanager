import React from "react";
import BackButton from "./back-button";

type TNavBar = {
  isBackEnabled?: boolean;
  isProfileEnabled?: boolean;
  Navlink?: string;
};

export default function NavBar({
  isBackEnabled = true,
  isProfileEnabled = false,
  Navlink = "/",
}: TNavBar) {
  return (
    <nav className=" flex py-3 mx-4 items-center w-full bg-white z-4">
      {isBackEnabled && <BackButton />}
    </nav>
  );
}
