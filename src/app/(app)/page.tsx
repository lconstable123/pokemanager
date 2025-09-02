"use client";
import Features from "../../../components/features";
import MainWindow from "../../../components/main-window";
import WindowBg from "../../../components/window-bg/window-bg";
import Nav from "../../../components/nav";
import AppPreview from "../../../components/app-preview";
import { motion } from "framer-motion";
const features = [
  "Full Stack with Next",
  "Optimistic Frontend",
  "Next-Auth",
  "Prisma and Postgres",
];
const navItems = [
  { name: "Login", ball: "02", href: "/login" },
  { name: "Sign Up", ball: "05", href: "/sign-up" },
];
const timeOffset1 = 0.2;
const timeOffset2 = 0.6;
const timeOffset3 = 1.2;
export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <MainWindow>
        <div className="relative pt-12 pb-7  px-0 md:px-50 flex flex-col justify-center items-center h-full w-full">
          <div className=" text-center flex px-10 flex-col  items-center justify-center md:flex-row gap-0 lg:gap-1 -translate-y-0 z-10">
            <WelcomeText />
            <AppPreview isMobile={false} />
          </div>
        </div>
        <div className=" mt-auto w-full flex flex-col items-center justify-center">
          <Features
            features={features}
            initialDelay={timeOffset1}
            delayBetweenItems={0.2}
          />
          <BottomText />
          <AppPreview isMobile={true} />
        </div>
        <WindowBg image="Snorlax" />
      </MainWindow>
    </div>
  );
}

//---------------------------------------------------

function WelcomeText() {
  return (
    <section className="  w-full  sm:w-full flex flex-col mx-6 justify-center items-center">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: timeOffset1, duration: 0.6 }}
        className=" my-0 py-0 text-[27pt]! "
      >
        POKEMON MANAGER
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: timeOffset1, duration: 0.6 }}
        className="  w-55 sm:w-full lg:w-full pb-1 mx-5 text-center sm:pb-3 text-gray-950/80 font-semibold Text-secondary text-[9pt] tracking-[2.5pt]"
      >
        Luke Constable / VirtuallyAnything
      </motion.div>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: timeOffset2, duration: 1.5 }}
        className=" my-0 pt-3 sm:pt-2 pb-6 text-[12pt]! 2xl:text-[15pt]! "
      >
        Take care of your ultimate lineup.
      </motion.h2>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          delay: timeOffset3,
          stiffness: 200,
          type: "spring",
          damping: 20,
        }}
      >
        <Nav items={navItems} />
      </motion.div>
    </section>
  );
}

function BottomText() {
  return (
    <div className="pb-1 mx-5 text-center sm:pb-1 text-gray-950/80 font-semibold  Text-secondary text-[6pt] tracking-[2.5pt]">
      Thanks to PokeApi for the Data, DeviantArt Assets: Hy-oppa | luqiPower
    </div>
  );
}
