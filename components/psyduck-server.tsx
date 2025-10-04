"use client";
import { cn, sleep } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { BiSolidServer } from "react-icons/bi";
import { FiMonitor } from "react-icons/fi";
import { motion, useAnimation } from "framer-motion";
import { useSingleImageLoader } from "@/lib/useImageLoader";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { revalidateAccountLayout } from "@/lib/actions";

export default function PsyduckServer() {
  const [error, setError] = useState(false);
  const {
    isMobile,
    isTransitionUi,
    handleToggleBadServer,
    serverError,
    psyduckServer,
  } = usePokeAppContext();

  const handleToggleError = async () => {
    await revalidateAccountLayout();

    setError(!error);
    handleToggleBadServer();
  };
  const controls = useAnimation();
  const isLoaded = useSingleImageLoader("/placeholders/pd_norm.png");
  const handleError = () => {
    controls.start({
      x: [0, -10, 10, -10, 10, -10, 10, 0],
      transition: { duration: 0.7 },
    });
  };
  const AnimateServerOut = async () => {
    await controls.start({
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.3 },
    });
  };

  const AnimateServerIn = async () => {
    controls.set({
      opacity: 0,
      scale: 0,
    });

    await sleep(1200);
    // toast.success("Psyduck server connected!");
    await controls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    });
  };

  useEffect(() => {
    if (!psyduckServer) {
      AnimateServerOut();
    } else {
      AnimateServerIn();
    }
  }, [psyduckServer]);

  useEffect(() => {
    if (serverError) {
      handleError();
    }
  }, [serverError]);

  return (
    <>
      {isLoaded && (
        <motion.section
          animate={controls}
          onClick={handleToggleError}
          className={cn(
            `${
              !isMobile ? "z-852" : "z-820"
            } cursor-pointer group hardSVGShadow absolute flex flex-col justify-center items-center gap-y-1 w-35 h-35 text-[8px] `,
            "-right-5 bottom-2   "
          )}
        >
          <PsyImg error={error} />
          <Server error={error} isFetching={isTransitionUi} />
          <BackBubble error={error} />
          <TextButton error={error} />
        </motion.section>
      )}
    </>
  );
}

const ElmBubble = ({
  children,
  error,
}: {
  children: React.ReactNode;
  error: boolean;
}) => {
  return (
    <div
      className={cn(
        "softShadow border-2 noSelect pointer-events-none border-gray-950 bg-yellow-400 ring-4 ring-yellow-200 flex justify-center  items-center w-7 h-7 rounded-full z-2 ",
        error
          ? "animate-pulse border-red-200 bg-red-600 ring-red-200 text-white"
          : "text-yellow-800"
      )}
    >
      {children}
    </div>
  );
};

const Server = ({
  error,
  isFetching,
}: {
  error: boolean;
  isFetching: boolean;
}) => {
  return (
    <div className="w-full  flex justify-center">
      <div
        className={cn(
          "noSelect delay-500  pointer-events-none  transition-all duration-300 delay-50 group-hover:mx-2 mx-3 flex w-full  justify-between items-center  ",
          error ? "opacity-100" : "group-hover:opacity-100 opacity-0"
        )}
      >
        <ElmBubble error={error}>
          <BiSolidServer className="w-7 h-7 top-0 right-0 m-1 z-4" size={12} />
        </ElmBubble>
        <Connection error={error} isFetching={isFetching} />
        <ElmBubble error={false}>
          <FiMonitor className="w-7 h-7 bottom-0 right-0 m-1 z-4" size={12} />
        </ElmBubble>
      </div>
    </div>
  );
};

const PsyImg = ({ error = false }: { error: boolean }) => {
  return (
    <div
      className={cn(
        "noSelect pointer-events-none pixelImg transition-all duration-300 softSVGShadow mb-1 w-20 h-20 border-amber-400",
        error
          ? "translate-y-1 scale-100"
          : "group-hover:translate-y-1 translate-y-15 group-hover:scale-100 scale-60 "
      )}
    >
      <div
        className={cn(
          "border-black duration-500 group-hover:opacity-0 opacity-100 absolute -top-2 -left-5",
          error && "opacity-0"
        )}
      >
        <ElmBubble error={false}>
          <FiMonitor className="w-7 h-7 bottom-0 right-0 m-1 z-4" size={12} />
        </ElmBubble>
      </div>
      {!error ? (
        <img src="/placeholders/pd_norm.png" alt="Psyduck" />
      ) : (
        <img
          src="/placeholders/pd_error.png"
          alt="Psyduck"
          className="animate-rocking"
        />
      )}
    </div>
  );
};

const BackBubble = ({ error }: { error: boolean }) => {
  return (
    <div
      className={cn(
        "noSelect pointer-events-none mt-8 w-35 h-30 border-2 border-yellow-700 ring-4 ring-yellow-400 w-30-h-30 absolute left-1/2 -translate-x-1/2 rounded-full -z-9",
        "transition-all duration-500  ",
        error
          ? " border-red-600 bg-red-500 ring-red-200"
          : "bg-yellow-100 scale-0 group-hover:scale-103"
      )}
    />
  );
};

const TextButton = ({ error }: { error: boolean }) => {
  return (
    <p
      className={cn(
        "noSelect pointer-events-none  tracking-wide! text-[10pt] text-white!",
        "hardShadow border-2 border-yellow-200 text-center  rounded-full py-1 px-2 my-1",
        "  group-hover:scale-100 translate-y-0 transition-all duration-500 group-hover:border-yellow-300 group-hover:translate-y-[-3px]  ",
        !error
          ? " border-red-200 bg-red-600 ring-red-200 scale-0"
          : "bg-yellow-700"
      )}
    >
      {!error ? "Disconnect server" : "Connect server"}
    </p>
  );
};

const Connection = ({
  error,
  isFetching,
}: {
  error: boolean;
  isFetching: boolean;
}) => {
  return (
    <>
      <div
        className={cn(
          "transition-all duration-500  relative h-1 w-full -z-4",
          error ? "bg-red-300" : "bg-yellow-400"
        )}
      />
      {/* {isFetching && (
        <div
          className={cn(
            "origin-center absolute right-0 w-3 h-3  rounded-full bg-white outline-yellow-600 outline-2 z-0",
            error ? "animate-bad-travel" : "animate-travel"
          )}
        />
      )} */}
    </>
  );
};
