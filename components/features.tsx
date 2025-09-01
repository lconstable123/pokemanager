import React from "react";
import Pokeball from "./pokeball";

export default function Features({ features }: { features: string[] }) {
  return (
    <ul className="flex gap-5 text-center justify-center mb-7 flex-wrap ">
      {features.map((feature, index) => (
        <li
          key={index}
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-0 group "
        >
          <div className="w-4 h-4 group-hover:scale-135 transition-all duration-200 ">
            <Pokeball type="09" fill={true} />
          </div>
          <div className="transition-all duration-200  w-20 ml-1 group-hover:-translate-y-1 pointer-events-none">
            <p className="">{feature}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
