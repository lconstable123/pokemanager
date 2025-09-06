// hooks/useIsMobile.js
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
