import React from "react";
import WindowBg from "./window-bg/window-bg";

export default function MainWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative hardShadow flex flex-col w-screen sm:w-[95vw] md:w-[700px] lg:w-[800px] 2xl:w-[1000px] overflow-hidden rounded-none sm:rounded-2xl">
      <FrameBar />
      <div className=" h-full  sm:h-[500px] md:h-[400px] 2xl:h-[600px] bg-white flex flex-col items-center justify-center relative">
        {children}
      </div>
      <FrameBar />
    </section>
  );
}

function FrameBar() {
  return <div className="bg-red-900 h-5 w-full" />;
}
