"use client";
import Features from "../../../components/features";
import MainWindow from "../../../components/main-window";
import WindowBg from "../../../components/window-bg/window-bg";
import Nav from "../../../components/nav";
import AppPreview from "../../../components/app-preview";
import { motion } from "framer-motion";

import { useIsMobile } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { timeOffset_1, timeOffset_2, timeOffset_3 } from "@/lib/constants";
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

export default function Home() {
  const { isMobile, isSmall } = useIsMobile();
  return (
    <WholeSection>
      <TopSection>
        <WelcomeText />
        {!isMobile && <AppPreview isMobile={false} />}
      </TopSection>
      <BottomSection>
        <Features
          features={features}
          initialDelay={timeOffset_1}
          delayBetweenItems={0.1}
        />
        {isMobile && <AppPreview isMobile={true} />}
      </BottomSection>
      <WindowBg image="Snorlax" />
    </WholeSection>
  );
}

//---------------------------------------------------

function TopSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full ml-7 mr-10 h-full flex flex-col justify-center ">
      <div
        className={cn(
          " text-center flex flex-col items-center gap-0 sm:gap-9 justify-center sm:flex-row ",
          " pb-7 translate-y-5 z-10"
        )}
      >
        {children}
      </div>
    </section>
  );
}

function BottomSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto flex flex-col items-center justify-center">
      {children}
    </div>
  );
}

function WholeSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-10 h-full flex flex-col items-center justify-center">
      {children}
    </div>
  );
}

function WelcomeText() {
  return (
    <section className="max-w-90 sm:max-w-120 sm:pb:0  flex flex-col  justify-center items-center">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: timeOffset_1, duration: 0.6 }}
        className="w-full mx-2 my-0 py-0 leading-12! sm:leading-8! text-[40pt]! sm:text-[28pt]! md:text-[27pt]! "
      >
        POKEMON MANAGER
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: timeOffset_2, duration: 1.5 }}
        className="w-full my-0 pt-3 sm:pt-2 pb-6 text-[13pt]! sm:text-[11pt]! md:text-[12pt]! 2xl:text-[15pt]! "
      >
        Take care of your ultimate lineup.
      </motion.h2>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          delay: timeOffset_1,
          stiffness: 100,
          type: "spring",
          damping: 20,
        }}
      >
        <Nav items={navItems} />
      </motion.div>
    </section>
  );
}
