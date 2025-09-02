"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SelectTrainerNav from "./select-trainer-nav";
import { cn } from "@/lib/utils";
import DirectionNav from "./direction-nav";
import { motion, useAnimation } from "framer-motion";
import { Label } from "@/components/ui/label";
import { MdOpacity } from "react-icons/md";
type SelectTrainerProps = {
  mode: "sign-up" | "sign-in";
  timeOffsets: { timeOffset1: number; timeOffset2: number };
};
export default function SelectTrainer({
  mode,
  timeOffsets,
}: SelectTrainerProps) {
  const trainerlength = mode === "sign-up" ? 9 : 2;
  const timeOffset3 = timeOffsets.timeOffset2 * 1000 + 900;
  const trainers = Array.from({ length: trainerlength }, (_, i) =>
    i.toString()
  );
  const [selectedTrainer, setSelectedTrainer] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [localTransitionSpeed, setLocalTransitionSpeed] = useState(400);
  const trainerFrameWidth = 210;
  const trainerFrameGap = 30;
  const trainerWidth = trainerFrameWidth - trainerFrameGap;
  const trainerOffset = trainerFrameWidth * selectedTrainer;

  const handleClick = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedTrainer((prev) => {
      setLocalTransitionSpeed(2700 * Math.abs(prev - index) * 0.1);
      return index;
    });
  };
  if (mode === "sign-up") {
    useEffect(() => {
      const timer = setTimeout(() => {
        setSelectedTrainer(1);
        setEngaged(true);
      }, timeOffset3);
      return () => clearTimeout(timer);
    }, []);
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0, duration: 0.3 }}
      className={` h-110 py-4 flex flex-col`}
    >
      <Label
        className={`transition-quick self-center ${
          !engaged ? "opacity-0" : "opacity-100"
        } `}
      >
        Choose your Avatar
      </Label>

      <div className=" user-select-none pt-1 flex items-center gap-1 w-full flex-grow">
        {mode === "sign-up" && (
          <DirectionNav
            direction="left"
            trainer={selectedTrainer}
            handleSetTrainer={setSelectedTrainer}
            trainerAmt={trainers.length}
            isEngaged={engaged}
          />
        )}
        <TrainerFrame trainerFrameWidth={trainerFrameWidth}>
          {trainers.map((trainer, index) => (
            <div
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
                className="translate-x-[10px] user-select-none pixelImage pointer-events-none "
                src={
                  index > 0
                    ? `/trainers/trainer_${index}.png`
                    : "/trainers/oak.png"
                }
                alt={trainer}
                width={350}
                height={350}
              />
            </div>
          ))}
          <TrainerBg
            selectedTrainer={selectedTrainer}
            localTransitionSpeed={localTransitionSpeed}
          />
        </TrainerFrame>

        {mode === "sign-up" && (
          <DirectionNav
            direction="right"
            trainer={selectedTrainer}
            handleSetTrainer={setSelectedTrainer}
            trainerAmt={trainers.length}
            isEngaged={engaged}
          />
        )}
      </div>

      {mode === "sign-up" && (
        <SelectTrainerNav
          trainers={trainers}
          selectedTrainer={selectedTrainer}
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
}: {
  selectedTrainer: number;
  localTransitionSpeed: number;
}) {
  const Bg1controls = useAnimation();
  const Bg2controls = useAnimation();
  // const duration = localTransitionSpeed * 0.0005;
  const duration = 0.4;
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
        transition: { delay: 0.1, duration: duration, ease: "easeOut" },
      }),
      Bg2controls.start({
        height: 200,
        transition: { duration: duration, ease: "easeOut" },
      }),
    ]);
  };

  const AnimateOut = async () => {
    await Promise.all([
      Bg1controls.start({
        height: 0,
        transition: { duration: 0.2, ease: "easeIn" },
      }),
      Bg2controls.start({
        height: 0,
        transition: { delay: 0.1, duration: 0.2, ease: "easeIn" },
      }),
    ]);
  };

  useEffect(() => {
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
    //   // AnimateIn();
    // }, 2);
    // return () => clearTimeout(timer);
  }, [selectedTrainer]);

  useEffect(() => {
    setFirstTime(false);
  }, []);

  return (
    <>
      <div className={`transition-all absolute inset-0 ${bg3} -z-5 `} />
      <motion.div
        // initial={{ height: 0 }}
        animate={Bg1controls}
        className={`absolute bottom-0 w-full h-30 ${bg1} -z-2 `}
      />
      <motion.div
        // initial={{ height: 0 }}
        animate={Bg2controls}
        className={`absolute bottom-0 w-full h-50 ${bg2} -z-3 `}
      />
      <motion.div
        // initial={{ height: 0 }}
        animate={{ height: 80 }}
        transition={{ duration: 0.2 }}
        className="ditheredGrad absolute top-0 -z-1 h-20 w-full scale-y-[-1] opacity-[20%]"
      />
      <motion.div
        // initial={{ height: 0 }}
        animate={{ height: 80 }}
        transition={{ delay: 0.2 }}
        className="ditheredGrad absolute bottom-0 -z-1 h-20 w-full opacity-[10%]"
      />
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
