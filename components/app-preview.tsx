import React from "react";

export default function AppPreview({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <section
        className={`relative overflow-hidden z-5  translate-y-0 visible h-40 md:h-0 md:invisible md:translate-y-[100%] pointer-events-none  w-screen md:w-[250px] border-t-2 lg:border-2   bg-gray-100/100  rounded-none lg:rounded-lg lg:hardShadow`}
      >
        <img
          src="/placeholders/app_placeholder.png"
          alt="App screenshot"
          className="absolute top-0 left-0   pointer-events-none scale-150  rotate-15 "
        />
      </section>
    );
  } else {
    return (
      <section
        className={` overflow-hidden invisible md:visible
 pointer-events-none  p-0 m-0 w-0 md:w-[350px] h-0 md:h-[200px] border-t-2 md:border-2   bg-gray-100/100  rounded-none md:rounded-lg md:hardShadow`}
      >
        <img
          src="/placeholders/app_placeholder.png"
          alt="App screenshot"
          className="pointer-events-none scale-150 rotate-15 group-hover:scale-170"
        />
      </section>
    );
  }
}
