import React from "react";
import WelcomeText from "./welcome-text";
import BackButton from "./back-button";
import SelectTrainer from "./select-trainer";
const timeOffsets = {
  timeOffset1: 0.2,
  timeOffset2: 1.7,
};
export default function EntryWindow({ mode }: { mode: "sign-up" | "sign-in" }) {
  return (
    <>
      <BackButton />
      <div className=" relative h-full w-full px-4 sm:px-20 pt-5 sm:pt-0 flex flex-col sm:flex-row justify-around items-center">
        <section className="flex justify-center items-center   ">
          <WelcomeText mode={mode} timeOffsets={timeOffsets} />
        </section>
        <SelectTrainer mode={mode} timeOffsets={timeOffsets} />
      </div>
    </>
  );
}
