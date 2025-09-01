import React from "react";
import WindowBg from "./window-bg/window-bg";

export default function MainWindow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="hardShadow flex flex-col w-[800px] overflow-hidden rounded-2xl">
      <FrameBar />
      <div className="h-[400px] bg-white flex items-center justify-center relative">
        {children}
      </div>
      <FrameBar />
    </section>
  );
}

function FrameBar() {
  return <div className="bg-red-900 h-5 w-full" />;
}
