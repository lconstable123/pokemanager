import { cn } from "@/lib/utils";
import Features from "../../../components/features";
import MainWindow from "../../../components/main-window";
import Pokeball from "../../../components/pokeball";
import WindowBg from "../../../components/window-bg/window-bg";
import { Button } from "@/components/ui/button";
import Nav from "../../../components/nav";
import AppPreview from "../../../components/app-preview";
// import { Link } from "next/link";
const features = [
  "Full Stack with Next",
  "Optimistic Frontend",
  "Next-Auth",
  "Prisma and Postgres",
];
const navItems = [
  { name: "Login", ball: "02" },
  { name: "Sign Up", ball: "05" },
];

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <MainWindow>
        <div className=" pt-12 pb-7 flex flex-col justify-center items-center h-full w-full">
          <div className=" text-center flex px-10 flex-col  items-center justify-center md:flex-row gap-0 lg:gap-1 -translate-y-0 z-10">
            <WelcomeText />
            <AppPreview isMobile={false} />
          </div>
        </div>
        <div className="mt-auto w-full">
          <Features features={features} />
          <AppPreview isMobile={true} />
        </div>
        <WindowBg image="Charizard" />
      </MainWindow>
    </div>
  );
}

function WelcomeText() {
  return (
    <section className=" w-full sm:w-full flex flex-col mx-6 justify-center items-center">
      <h1 className=" my-0 py-0">POKEMON MANAGER</h1>
      <h2 className=" my-0 pt-3 sm:pt-2 pb-6 ">
        take care of your ultimate lineup
      </h2>
      <Nav items={navItems} />
    </section>
  );
}
