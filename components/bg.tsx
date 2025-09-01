import React from "react";

export default function BG() {
  return (
    <>
      <div className="absolute h-screen w-full bg1 -z-3 top-0">
        <div className="ditheredGradRed absolute top-0 -z-2 h-30 w-full scale-y-[-1] opacity-[40%]" />
        <div className="ditheredGradRed absolute bottom-0 -z-2 h-30 w-full opacity-[40%]" />
        {/* <div className="absolute inset-0 " /> */}
      </div>
    </>
  );
}
