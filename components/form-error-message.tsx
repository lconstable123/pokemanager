import React from "react";

export default function FormErrorMessage({ message }: { message: string }) {
  return (
    <p className="absolute text-left tracking-wider! -bottom-4 left-1/2 -translate-x-1/2 w-full text-red-600!  text-[7pt]!">
      {message}
    </p>
  );
}
