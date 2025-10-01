// hooks/useIsMobile.js
import { SetStateAction, use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTrainerContext } from "./contexts/TrainerContext";

export const useFontsLoaded = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document?.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(false);
    }
  }, []);
  return fontsLoaded;
};

export const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const smMediaQuery = window.matchMedia(`(max-width: 768px)`);
    const handleChange = () => {
      //   toast.success(
      //     mediaQuery.matches
      //       ? "Switched to mobile view"
      //       : "Switched to desktop view"
      //   );
      setIsMobile(mediaQuery.matches);
      setIsSmall(smMediaQuery.matches);
    };

    handleChange(); // Set initial value
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return { isMobile, isSmall };
};

export const useLineUp = () => {
  const { lineUp, handleReorder, slots } = useTrainerContext();
  const [ballEdit, setBallEdit] = useState<number | null>(null);
  const [ballShiftMode, setBallShiftMode] = useState<"select" | "shift">(
    "select"
  );
  const [isReordering, setReordering] = useState(false);
  const handleToggleReorder = () => {
    setReordering((prev) => {
      if (prev) {
        resetShifting();
      }
      return !prev;
    });
  };
  const resetShifting = () => {
    setBallEdit(null);
    setBallShiftMode("select");
  };

  const handleBallClick = (selectedBallIndex?: number) => {
    if (isReordering && selectedBallIndex !== undefined) {
      //reorder mode toggled
      if (ballShiftMode === "select") {
        setBallEdit(selectedBallIndex);
        setBallShiftMode("shift");
      } else if (ballEdit !== null) {
        handleReorder(ballEdit, selectedBallIndex);
        resetShifting();
      }
    } else {
      // toast.success("navigating inside ball");
    }
  };

  return {
    lineUp,
    handleReorder,
    slots,
    ballEdit,
    ballShiftMode,
    isReordering,
    handleToggleReorder,
    handleBallClick,
  };
};

export function useScrollStatus(debounceMs = 200) {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      toast.success("scrolling");
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        toast.success("stopped scrolling");
        setIsScrolling(false);
      }, debounceMs);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
    };
  }, [debounceMs]);

  return isScrolling;
}

export function usePreloadImage(
  imageUrl: string | null,
  handleLoading: React.Dispatch<SetStateAction<boolean>>
) {
  // const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.src = imageUrl;

    const handleLoad = () => {
      // toast.success("image loaded: " + imageUrl);

      handleLoading(true);
    };
    const handleError = () => {
      console.error("failed to load image:", imageUrl);
      handleLoading(false);
    };

    img.onload = handleLoad;
    img.onerror = handleError;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  // return isLoaded;
}

export const UseDisableScroll = (time = 500) => {
  const scrollContainer = (document.scrollingElement ||
    document.documentElement) as HTMLElement;

  // Temporarily disable smooth scrolling to prevent auto-scroll during animation

  scrollContainer.style.scrollBehavior = "auto";
  scrollContainer.style.overflow = "hidden";

  // Optionally restore it after animation (e.g. after 500ms)
  setTimeout(() => {
    scrollContainer.style.overflow = "auto";
    scrollContainer.style.scrollBehavior = "smooth";
  }, time);
};
