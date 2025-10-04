import React from "react";

export default function Canvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full overflow-hidden sm:h-screen  flex justify-center items-center">
      {children}
    </div>
  );
}
