"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { UseDisableScroll, useIsMobile } from "../hooks";
import toast from "react-hot-toast";
import { ApiPkData, TPokemon, TTrainer } from "../types";
import { AddTrainer, SignOutTrainer } from "../actions";
import { useRouter } from "next/navigation";

type AppContextType = {
  isMobile: boolean;
  isSmall: boolean;
  disableScroll: (time?: number) => void;
  AddPkModalopen: boolean;
  setAddPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  EditPkModalopen: boolean;
  setEditPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPk: TPokemon | null;
  setSelectedPk: React.Dispatch<React.SetStateAction<TPokemon | null>>;
  evolutions: string[];
  selectedFormTrainer: number;
  setSelectedFormTrainer: React.Dispatch<React.SetStateAction<number>>;
  setEvolutions: React.Dispatch<React.SetStateAction<string[]>>;
  isInspectingLineup: boolean;
  setIsInspectingLineup: React.Dispatch<React.SetStateAction<boolean>>;
  badServer: boolean;
  isTransitionUi: boolean;
  serverError: boolean;

  //handles
  handleSelectPk: (pokemon: TPokemon) => void;
  handleToggleBadServer: () => void;
  handleSignOut: () => void;
  handleSignUp: (data: unknown) => Promise<void>;
  // handleSignIn: (trainer: TTrainer) => void;

  //transitions
  editPkTransition: boolean;
  deletePkTransition: boolean;
  addPkTransition: boolean;
  signOutTransition: boolean;
  startEditTransition: React.TransitionStartFunction;
  startDeletePkTransition: React.TransitionStartFunction;
  startAddPkTransition: React.TransitionStartFunction;
  startSignOutTransition: React.TransitionStartFunction;
  startRearranging: React.TransitionStartFunction;
  handleServerError: () => void;
  isRearranging: boolean;
  trainer: TTrainer | null;
  setTrainer: React.Dispatch<React.SetStateAction<TTrainer | null>>;
  handlePageTransition: (destination: string, duration: number) => void;
  pageTransition: boolean;
};

export const PokeAppContext = createContext<AppContextType | null>(null);

export default function PokeAppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isSmall } = useIsMobile(); // default 640px breakpoint
  const [trainer, setTrainer] = useState<TTrainer | null>(null);
  const [selectedPk, setSelectedPk] = useState<TPokemon | null>(null);
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedFormTrainer, setSelectedFormTrainer] = useState(0);
  const [badServer, setBadServer] = useState(false);
  const [serverError, setServerError] = useState(false);
  //transitions
  const [EditPkModalopen, setEditPkModalOpen] = useState(false);
  const [AddPkModalopen, setAddPkModalOpen] = useState(false);
  const [isInspectingLineup, setIsInspectingLineup] = useState(true);
  const [isRearranging, startRearranging] = useTransition();
  const [editPkTransition, startEditTransition] = useTransition();
  const [deletePkTransition, startDeletePkTransition] = useTransition();
  const [addPkTransition, startAddPkTransition] = useTransition();
  const [signOutTransition, startSignOutTransition] = useTransition();
  const router = useRouter();
  const isTransitionUi =
    addPkTransition ||
    editPkTransition ||
    deletePkTransition ||
    signOutTransition ||
    isRearranging;

  //------------------------------------------------Selection of Pokémon from list
  const handleSelectPk = (pokemon: TPokemon) => {
    if (selectedPk && EditPkModalopen) {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
      // toast.error("modeal is already open.");
      setAddPkModalOpen(false);
      setSelectedPk(pokemon);
      modalTimerRef.current = setTimeout(() => {
        setAddPkModalOpen(true);
        // toast.success("Switched to new Pokémon.");
      }, 1000);
      return;
    } else if (pokemon) {
      setSelectedPk(pokemon);
      setEditPkModalOpen(true);
    }
  };

  //-------------------------------------------------Toggle bad server for testing

  const handleToggleBadServer = () => {
    setBadServer((prev) => !prev);
  };

  const handleServerError = () => {
    setServerError(true);
    setTimeout(() => setServerError(false), 100);
  };

  //---------------------------------------------------------------------SIGN UP
  const handleSignUp = async (data: unknown) => {
    setTrainer(data as TTrainer);
    const error = await AddTrainer(data);
    if (error) {
      handleServerError();
      // toast.error("Failed to sign up." + error.message);
      return;
    } else {
      // toast.success("Signing up..." + (data as TTrainer).name);
    }
  };

  const [pageTransition, setPageTransition] = useState(false);

  const handlePageTransition = (destination: string, duration: number) => {
    setPageTransition(true);
    toast.success("moving to new page...");
    setTimeout(() => {
      router.push(destination);
    }, duration);
    setTimeout(() => {
      setPageTransition(false);
    }, duration + 250);
  };

  const handleSignOut = async () => {
    if (isTransitionUi) return;
    startSignOutTransition(async () => {
      await SignOutTrainer();
      setTrainer(null);
      router.refresh();
      handlePageTransition("/", 400);
    });
  };

  // const handleSignIn = async (trainer: TTrainer) => {
  //   handlePageTransition("/account", 2000);
  // };

  useEffect(() => {
    if (AddPkModalopen) {
      setIsInspectingLineup(false);
    }
    if (EditPkModalopen) {
      setIsInspectingLineup(true);
    }
  }, [AddPkModalopen, EditPkModalopen]);

  const disableScroll = UseDisableScroll;

  return (
    <PokeAppContext.Provider
      value={{
        isMobile,
        isSmall,
        disableScroll,
        AddPkModalopen,
        setAddPkModalOpen,
        EditPkModalopen,
        setEditPkModalOpen,
        selectedPk,
        setSelectedPk,
        handleSelectPk,
        evolutions,
        setEvolutions,
        selectedFormTrainer,
        setSelectedFormTrainer,
        isInspectingLineup,
        setIsInspectingLineup,
        handleToggleBadServer,
        badServer,
        isTransitionUi,
        addPkTransition,
        editPkTransition,
        deletePkTransition,
        signOutTransition,
        startAddPkTransition,
        startEditTransition,
        startDeletePkTransition,
        startSignOutTransition,
        startRearranging,
        serverError,
        handleServerError,
        isRearranging,
        trainer,
        setTrainer,
        handleSignOut,
        handleSignUp,
        // handleSignIn,
        handlePageTransition,
        pageTransition,
      }}
    >
      {children}
    </PokeAppContext.Provider>
  );
}

export function usePokeAppContext() {
  const context = useContext(PokeAppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppContextProvider");
  return context;
}
