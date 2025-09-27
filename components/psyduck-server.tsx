import React from "react";
import { BiSolidServer } from "react-icons/bi";
import { FiMonitor } from "react-icons/fi";
export default function PsyduckServer() {
  return (
    <section className="z-40 absolute flex flex-col justify-center items-center gap-y-1  w-40 h-50 bottom-5 right-50 text-[8px] select-none">
      <PsyImg />
      <Server />
      <BackBubble />
      <p className="text-sm">Disconnect from server</p>
    </section>
  );
}

const ElmBubble = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-2 border-yellow-300 ring-4 ring-yellow-700 flex justify-center  items-center w-7 h-7 rounded-full bg-white">
      {children}
    </div>
  );
};

const Server = () => {
  return (
    <div className="w-full  flex justify-center">
      <div className="flex w-full mx-3 justify-between items-center  text-yellow-800">
        <ElmBubble>
          <BiSolidServer className="w-7 h-7 top-0 right-0 m-1 z-4" size={12} />
        </ElmBubble>
        <div className="relative  h-1 w-full bg-yellow-700 -z-4" />
        <ElmBubble>
          <FiMonitor className="w-7 h-7 bottom-0 right-0 m-1 z-4" size={12} />
        </ElmBubble>
      </div>
    </div>
  );
};

const PsyImg = () => {
  return (
    <div className="w-20 h-20 border-amber-400">
      <img src="/placeholders/pd_norm.png" alt="Psyduck" />
    </div>
  );
};

const BackBubble = () => {
  return (
    <div className="m-5 border-2 border-yellow-600 ring-3 bg-yellow-100 ring-yellow-500 w-30-h-30 absolute inset-0 rounded-full -z-9" />
  );
};
