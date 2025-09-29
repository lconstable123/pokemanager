"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SelectTrainerNav from "./select-trainer-nav";
import { cn } from "@/lib/utils";
import DirectionNav from "./direction-nav";
import { motion, useAnimation } from "framer-motion";
import { Label } from "@/components/ui/label";
import { timeOffset_1, timeOffset_2, timeOffset_3 } from "@/lib/constants";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { set } from "zod";
import { toast } from "react-hot-toast";
type SelectTrainerProps = {
  mode: "sign-up" | "sign-in";
};
export default function SelectTrainer({ mode }: SelectTrainerProps) {
  const trainerlength = mode === "sign-up" ? 9 : 2;
  // const timeOffset3 = timeOffset_2 * 1000 + 900;
  const trainers = Array.from({ length: trainerlength }, (_, i) =>
    i.toString()
  );
  const { selectedFormTrainer, setSelectedFormTrainer } = usePokeAppContext();
  // const [selectedTrainer, setSelectedTrainer] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [bgAnimating, setBgAnimating] = useState(true);
  const [localTransitionSpeed, setLocalTransitionSpeed] = useState(400);
  const trainerFrameWidth = 210;
  const trainerFrameGap = 30;
  const trainerWidth = trainerFrameWidth - trainerFrameGap;
  const trainerOffset = trainerFrameWidth * selectedFormTrainer;
  const calculateTransitionSpeed = (index: number) => {
    return 2700 * Math.abs(selectedFormTrainer - index) * 0.1;
  };
  const handleClick = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalTransitionSpeed(calculateTransitionSpeed(index));
    setSelectedFormTrainer((prev) => {
      return index;
    });
  };
  //if sign up mode, display prof Oak and then Ash after delay
  if (mode === "sign-up") {
    useEffect(() => {
      setBgAnimating(false);
      setLocalTransitionSpeed(0);
      setSelectedFormTrainer(0);
      const timer = setTimeout(() => {
        setBgAnimating(true);
        setLocalTransitionSpeed(500);
        setSelectedFormTrainer(1);
        setEngaged(true);
      }, timeOffset_3 * 1000);
      return () => clearTimeout(timer);
    }, []);
  }
  if (mode === "sign-in") {
    useEffect(() => {
      setBgAnimating(false);
      setLocalTransitionSpeed(0);
      setSelectedFormTrainer(0);
    }, []);
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "tween",

        duration: 0.2,
      }}
      className={`mb-0 sm:mb-0 h-full  flex flex-col z-50`}
    >
      <Label
        className={`transition-quick self-center ${
          !engaged ? "opacity-0" : "opacity-100"
        } `}
      >
        Choose your Avatar
      </Label>

      <div className=" user-select-none pt-1  flex items-center gap-1 w-full flex-grow">
        {mode === "sign-up" && (
          <DirectionNav
            direction="left"
            trainer={selectedFormTrainer}
            handleSetTrainer={setSelectedFormTrainer}
            trainerAmt={trainers.length}
            isEngaged={engaged}
          />
        )}
        <TrainerFrame trainerFrameWidth={trainerFrameWidth}>
          {trainers.map((trainer, index) => (
            <motion.div
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              key={trainer}
              style={{
                width: trainerWidth,
                marginRight: `${trainerFrameGap}px`,
                transform: `translateX(-${trainerOffset}px)`,
                transitionDuration: `${localTransitionSpeed}ms`,
              }}
              className={cn(
                `transition-all pointer-events-none `,
                index === 0 && `translate-y-[35px]`
              )}
            >
              <Image
                priority
                className="animate-breathing translate-x-[10px] user-select-none pixelImage pointer-events-none "
                src={
                  index > 0
                    ? `/trainers/trainer_${index}.png`
                    : "/trainers/oak.png"
                }
                alt={trainer}
                width={350}
                height={350}
              />
            </motion.div>
          ))}
          <TrainerBg
            selectedTrainer={selectedFormTrainer}
            localTransitionSpeed={0}
            isAnimating={bgAnimating}
          />
        </TrainerFrame>

        {mode === "sign-up" && (
          <DirectionNav
            direction="right"
            trainer={selectedFormTrainer}
            handleSetTrainer={setSelectedFormTrainer}
            trainerAmt={trainers.length}
            isEngaged={engaged}
          />
        )}
      </div>

      {mode === "sign-up" && (
        <SelectTrainerNav
          trainers={trainers}
          selectedTrainer={selectedFormTrainer}
          handleClick={handleClick}
          isEngaged={engaged}
        />
      )}
    </motion.section>
  );
}

function TrainerBg({
  selectedTrainer,
  localTransitionSpeed,
  isAnimating,
}: {
  selectedTrainer: number;
  localTransitionSpeed: number;
  isAnimating?: boolean;
}) {
  const Bg1controls = useAnimation();
  const Bg2controls = useAnimation();
  // const duration = localTransitionSpeed * 0.0005;
  let durationIn: number, durationOut: number;
  if (isAnimating) {
    durationIn = 0.4;
    durationOut = 0.2;
  } else {
    durationIn = 0.4;
    durationOut = 0.2;
  }

  const trainerColors = [
    { bg1: "bg-green-400", bg2: "bg-green-300", bg3: "bg-green-200" },
    { bg1: "bg-blue-400", bg2: "bg-blue-300", bg3: "bg-blue-200" },
    { bg1: "bg-red-400", bg2: "bg-red-300", bg3: "bg-red-200" },
    { bg1: "bg-yellow-400", bg2: "bg-yellow-300", bg3: "bg-yellow-200" },
    { bg1: "bg-pink-400", bg2: "bg-pink-300", bg3: "bg-pink-200" },
    { bg1: "bg-purple-400", bg2: "bg-purple-300", bg3: "bg-purple-200" },
    { bg1: "bg-orange-400", bg2: "bg-orange-300", bg3: "bg-orange-200" },
    { bg1: "bg-emerald-400", bg2: "bg-emerald-300", bg3: "bg-emerald-200" },
    { bg1: "bg-sky-400", bg2: "bg-sky-300", bg3: "bg-sky-200" },
  ];
  const [firstTime, setFirstTime] = useState(true);
  const [selectedTrainerColours, setSelectedTrainerColors] = useState(
    trainerColors[0]
  );
  const { bg1, bg2, bg3 } = selectedTrainerColours;

  const AnimateIn = async () => {
    await Promise.all([
      Bg1controls.start({
        height: 120,
        opacity: 1,
        transition: { delay: 0.1, duration: durationIn, ease: "easeOut" },
      }),
      Bg2controls.start({
        height: 200,
        opacity: 1,
        transition: { duration: durationIn, ease: "easeOut" },
      }),
    ]);
  };

  const AnimateOut = async () => {
    await Promise.all([
      Bg1controls.start({
        height: 0,
        opacity: 0,
        transition: { duration: durationOut, ease: "easeIn" },
      }),
      Bg2controls.start({
        height: 0,
        opacity: 0,
        transition: { delay: 0.1, duration: durationOut, ease: "easeIn" },
      }),
    ]);
  };

  useEffect(() => {
    // toast.success("Selected Avatar Changed!");
    const run = async () => {
      await AnimateOut().then(() =>
        setSelectedTrainerColors(
          trainerColors[selectedTrainer % trainerColors.length]
        )
      );
      await AnimateIn();
    };
    if (!firstTime) run();
    // const timer = setTimeout(() => {
    //   AnimateIn();
    // }, 2);
    // return () => clearTimeout(timer);
  }, [selectedTrainer]);

  useEffect(() => {
    setFirstTime(false);
  }, []);

  return (
    <>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={Bg1controls}
        className={`absolute bottom-0 w-full h-30 ${bg1} -z-2 `}
      />
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={Bg2controls}
        className={`absolute bottom-0 w-full h-50 ${bg2} -z-4 `}
      />
      <motion.div className="ditheredGrad absolute top-0 z-3 h-20 w-full scale-y-[-1] opacity-10 " />
      <motion.div className="ditheredGrad absolute bottom-0 z-3 h-20 w-full opacity-10 " />
      <div className={`transition-all absolute inset-0 ${bg3} -z-8 `} />
    </>
  );
}

function TrainerFrame({
  children,
  trainerFrameWidth,
}: {
  children: React.ReactNode;
  trainerFrameWidth: number;
}) {
  return (
    <div
      style={{
        width: trainerFrameWidth,
      }}
      className="user-select-none pointer-events-none relative z-2 w-full h-80  imageFrame overflow-hidden bg-white rounded-2xl"
    >
      <div className="pointer-events-none  absolute left-0 bottom-0 flex flex-row ">
        {children}
      </div>
    </div>
  );
}
