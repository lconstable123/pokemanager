"use client";
import React, { useState } from "react";
import MainWindow from "../../../../components/main-window";
import WindowBg from "../../../../components/window-bg/window-bg";

import BackButton from "../../../../components/back-button";
import Image from "next/image";
const trainerlength = 9;
const trainers = Array.from({ length: trainerlength }, (_, i) => i.toString());
export default function Page() {
  const [selectedTrainer, setSelectedTrainer] = useState("1");
  return (
    <div className=" w-screen h-screen flex justify-center items-center">
      <MainWindow>
        <BackButton />
        <div className="flex flex-row justify-center items-center border-1 gap-10">
          <div className="border-1 relative pt-12 pb-7 flex flex-col justify-center items-center h-full ">
            <h1>Welcome, trainer!</h1>
            <h2 className=" my-0 pt-6 sm:pt-4 pb-6 ">
              Enter your details to get started.
            </h2>
          </div>
          <section className="w-[250px] h-[400px] border-1 flex-flex-col">
            <div className="bg-amber-200" />
            <div className="flex flex-row">
              {trainers.map((trainer, index) => (
                <div key={trainer} className="p-2 border-b border-b-amber-200">
                  <Image
                    src={
                      index > 0
                        ? `/trainers/trainer_${index}.png`
                        : "/trainers/oak.png"
                    }
                    alt={trainer}
                    width={250}
                    height={250}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-row justify-center gap-2">
              {trainers.map((trainer, index) => {
                return (
                  <div
                    className={`${
                      selectedTrainer === index.toString()
                        ? "bg-gray-800"
                        : "bg-gray-200"
                    } h-3 w-3 rounded-full `}
                  ></div>
                );
              })}
            </div>
          </section>
        </div>

        <WindowBg image="Charizard" />
      </MainWindow>
    </div>
  );
}
