"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { UseDisableScroll, useIsMobile, useWindowWidth } from "../hooks";
import toast from "react-hot-toast";
import { ApiPkData, TPokemon, TTrainer } from "../types";
import { AddTrainer, SignOutTrainer } from "../actions";
import { useRouter } from "next/navigation";
import { set } from "zod";
import { start } from "repl";
import { LegacyAnimationControls, useAnimation } from "framer-motion";
import { sleep } from "../utils";
import usePageTransition from "../usePageTransition";

type AppContextType = {
  //utils
  isMobile: boolean;
  isSmall: boolean;
  disableScroll: (time?: number) => void;
  windowWidth: number;

  //states
  AddPkModalopen: boolean;
  setAddPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  EditPkModalopen: boolean;
  setEditPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isInspectingLineup: boolean;
  setIsInspectingLineup: React.Dispatch<React.SetStateAction<boolean>>;

  //stores
  selectedPk: TPokemon | null;
  setSelectedPk: React.Dispatch<React.SetStateAction<TPokemon | null>>;
  evolutions: string[];
  selectedFormTrainer: number;
  setSelectedFormTrainer: React.Dispatch<React.SetStateAction<number>>;
  setEvolutions: React.Dispatch<React.SetStateAction<string[]>>;
  trainer: TTrainer | null;
  setTrainer: React.Dispatch<React.SetStateAction<TTrainer | null>>;

  //debugs
  badServer: boolean;
  isTransitionUi: boolean;
  serverError: boolean;
  psyduckServer: boolean;
  setPsyduckServer: React.Dispatch<React.SetStateAction<boolean>>;

  //handles
  handleSelectPk: (pokemon: TPokemon) => void;
  handleToggleBadServer: () => void;
  handleSignOut: () => void;
  handleSignUp: (data: unknown) => Promise<{ message: string } | void>;

  //transitions
  editPkTransition: boolean;
  deletePkTransition: boolean;
  addPkTransition: boolean;
  signOutTransition: boolean;
  isRearranging: boolean;
  startEditTransition: React.TransitionStartFunction;
  startDeletePkTransition: React.TransitionStartFunction;
  startAddPkTransition: React.TransitionStartFunction;
  startSignOutTransition: React.TransitionStartFunction;
  startRearranging: React.TransitionStartFunction;
  handleServerError: () => void;
  handlePageTransition: (destination: string, duration: number) => void;
  pageAnimControls: LegacyAnimationControls;
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
  const [psyduckServer, setPsyduckServer] = useState(false);

  //------------------------------------------------------------------ transitions

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

  const { pageAnimControls, handlePageTransition } = usePageTransition(router);

  //------------------------------------------------Selection of Pokémon from list

  const handleSelectPk = (pokemon: TPokemon) => {
    if (selectedPk && EditPkModalopen) {
      if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
      setAddPkModalOpen(false);
      setSelectedPk(pokemon);
      modalTimerRef.current = setTimeout(() => {
        setAddPkModalOpen(true);
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
    const error = await AddTrainer(data);
    if (error) {
      handleServerError();
      toast.error(error.message);
      return error;
    } else {
      setTrainer(data as TTrainer);
      return;
    }
  };

  // const handleSignIn = async (trainer: TTrainer) => {
  //   handlePageTransition("/account", 2000);
  // };

  //---------------------------------------------------------------------SIGN OUT

  const handleSignOut = async () => {
    if (isTransitionUi) return;
    startSignOutTransition(async () => {
      await SignOutTrainer();
      setPsyduckServer(false);
      setTrainer(null);
      // router.refresh();
      handlePageTransition("/", 0.1);
    });
  };

  useEffect(() => {
    if (AddPkModalopen) {
      setIsInspectingLineup(false);
    }
    if (EditPkModalopen) {
      setIsInspectingLineup(true);
    }
  }, [AddPkModalopen, EditPkModalopen]);

  const disableScroll = UseDisableScroll;
  const windowWidth = useWindowWidth();
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
        handlePageTransition,
        pageAnimControls,
        psyduckServer,
        setPsyduckServer,
        windowWidth,
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
