"use client";
import Features from "../../../components/features";
import MainWindow from "../../../components/main-window";
import WindowBg from "../../../components/window-bg/window-bg";
import Nav from "../../../components/nav";
import AppPreview from "../../../components/app-preview";
import { motion, useAnimation } from "framer-motion";

import { useFontsLoaded, useIsMobile } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { timeOffset_1, timeOffset_2, timeOffset_3 } from "@/lib/constants";
import LoadingContent from "../../../components/loading-content";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { useEffect } from "react";
import { p } from "framer-motion/client";
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
  const fontsLoaded = useFontsLoaded();
  return (
    <WholeSection>
      {fontsLoaded ? (
        <>
          <TopSection>
            <WelcomeText />
            {/* {!isMobile && <AppPreview isMobile={false} />} */}
          </TopSection>

          <BottomSection>
            <Features
              features={features}
              initialDelay={timeOffset_1}
              delayBetweenItems={0.1}
            />
            {/* {isMobile && <AppPreview isMobile={true} />} */}
          </BottomSection>
        </>
      ) : (
        <div className="h-[712px]">
          <LoadingContent />
        </div>
      )}
      <WindowBg image="Snorlax" />
    </WholeSection>
  );
}

//---------------------------------------------------

function TopSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="pt-8 sm:max-w-140 md:max-w-160 lg:max-w-170 2xl:max-w-200   h-full flex flex-col justify-center ">
      <div className={cn(" ")}>{children}</div>
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
    <div
      className={`mx-0  
      } h-full flex flex-col items-center justify-center`}
    >
      {children}
    </div>
  );
}

function WelcomeText() {
  return (
    <section className="text-center max-w-90 sm:pb:0 flex flex-col justify-center items-center">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="noSelect w-full mx-2 mb-1 sm:mb-1 lg:mb-1 py-0 leading-12! sm:leading-11! text-[40pt]! sm:text-[37pt]!  "
      >
        POKEMON MANAGER
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: timeOffset_1, duration: 2 }}
        className="noSelect w-full my-0 pt-1 sm:pt-1 pb-6 text-[13pt]!   "
      >
        Take care of your ultimate lineup.
      </motion.h2>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          ease: "easeOut",
          delay: timeOffset_3,
          stiffness: 50,
          type: "spring",
          damping: 20,
        }}
      >
        <Nav items={navItems} />
      </motion.div>
    </section>
  );
}
