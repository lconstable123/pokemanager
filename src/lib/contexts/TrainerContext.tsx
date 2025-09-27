"use client";
import React, {
  createContext,
  useContext,
  useState,
  useOptimistic,
  useTransition,
  useMemo,
} from "react";
import {
  Element,
  OptimisticAction,
  ServerTrainerWithLineup,
  TLineUp,
  TPokemon,
  TTrainer,
} from "../types";
import toast from "react-hot-toast";
import { AddPkFormValues, EditPkFormValues } from "../schemas";
import { AddPokemon, AddTrainer, DeletePokemon, EditPokemon } from "../actions";
import useBallReorder from "../useBallReorder";
import { v4 as uuidv4 } from "uuid";

//-----------------------------------------------------Trainer Context Provider
// Manages trainer state and optimistic UI for lineup changes
// Types at end of file

export default function TrainerContextProvider({
  children,
  trainerFromServer,
}: {
  children: React.ReactNode;
  trainerFromServer: ServerTrainerWithLineup | null;
}) {
  //------------------------------------------------------------------Stores

  // derive lineup from initial server data
  const initialLineUp: TPokemon[] = useMemo(() => {
    return (
      trainerFromServer?.lineup.map((pk) => ({
        ...pk,
        id: pk.id,
        name: pk.name,
        sprite: pk.sprite,
        ball: pk.ball,
        species: pk.species,
        exp: pk.exp,
        type: JSON.parse(pk.types) as Element[],
      })) || []
    );
  }, [trainerFromServer?.lineup]);

  // derive trainer from initial server data
  const initialTrainer: TTrainer = useMemo(() => {
    return {
      id: trainerFromServer?.id || "",
      name: trainerFromServer?.name || "",
      email: trainerFromServer?.email || "",
      avatar: trainerFromServer?.avatar || 0,
      lineup: initialLineUp,
    };
  }, [trainerFromServer, initialLineUp]);

  const [trainer, setTrainer] = useState<TTrainer | null>(initialTrainer);
  const [badServer, setBadServer] = useState(false);

  //---------------------------------------------------------------------Optimistic UI Lineup

  const [optimisticLineUp, setOptimisticLineup] = useOptimistic<
    TPokemon[],
    OptimisticAction
  >(initialLineUp, (state, { action, payload }) => {
    switch (action) {
      case "add":
        console.log("adding", payload);
        const alreadyExists = state.find((pk) => pk.id === payload.id);
        if (alreadyExists) {
          return state;
        } else {
          return [...state, payload];
        }
      case "edit":
        console.log("editing", payload);
        return state.map((pk) =>
          pk.id === payload.id ? { ...pk, ...payload } : pk
        );
      case "delete":
        console.log("deleting", payload.id);
        return state.filter((pk) => pk.id !== payload.id);
      case "rearrange": {
        const updated = [...state];
        const [moved] = updated.splice(payload.fromIndex, 1);
        updated.splice(payload.toIndex, 0, moved);
        console.log(updated);
        return updated;
      }
      case "commit":
        console.log("committing");
        return payload;
      case "clear":
        console.log("clearing lineup");
        return [];
      default:
        console.log("unknown action");
        return state;
    }
  });

  //-----------------------------------------divergent state of optimistic UI during rearranging

  const [lineupRearrange, setLineupRearrange] =
    useState<TLineUp>(optimisticLineUp);

  const handleCalculateSlots = (lineUp: TPokemon[]) => {
    return Array.from({ length: 6 }, (_, i) =>
      lineUp[i]
        ? { id: lineUp[i].id, name: lineUp[i].name, empty: false }
        : { id: "empty" + (i + 1), name: "Empty Slot " + (i + 1), empty: true }
    );
  };

  //--------------------------------------------------------------------Transitions

  const [editPkTransition, startEditTransition] = useTransition();
  const [deletePkTransition, startDeletePkTransition] = useTransition();
  const [addPkTransition, startAddPkTransition] = useTransition();
  const [signOutTransition, startSignOutTransition] = useTransition();

  // any transition in progress
  const isTransitionUi =
    addPkTransition ||
    editPkTransition ||
    deletePkTransition ||
    signOutTransition;

  //---------------------------------------------------------------------Ball Logic
  const {
    //----------------------ball reorder outputs
    ballEdit,
    handleReorder,
    ballShiftMode,
    isReordering,
    handleToggleReorder,
    handleBallClick,
    ballLayoutEnabled,
    uiLineup,
  } = useBallReorder({
    //-----------------------ball reorder inputs
    optimisticLineUp,
    setOptimisticLineup,
    badServer,
    lineupRearrange,
    setLineupRearrange,
  });

  //-----------------------------------------------------------------------------HANDLERS

  //-----after rearranging, finally prepare the slots for rendering

  const slots = handleCalculateSlots(uiLineup);

  //---------------------------------------------------------------------ADD PK

  const handleAddPokemon = async (Pk: AddPkFormValues) => {
    // source of key for optimistic UI and server
    const Id = uuidv4();
    const UIPk: TPokemon = {
      id: Id,
      ball: Pk.Ball,
      species: Pk.Pokemon,
      name: Pk.Name,
      type: Pk.Type as Element[],
      exp: Pk.Xp,
      sprite: Pk.Sprite,
      order: Pk.Order,
    };

    startAddPkTransition(() => {
      setOptimisticLineup({ action: "add", payload: UIPk });
    });

    const error = await AddPokemon(
      !badServer ? Pk : "invalid-id-to-test-error",
      Id
    );

    if (error) {
      toast.error("Server Failed to add Pokémon.");
      console.log(error);
      return;
    }
    toast.success("Pokémon added to server");
  };

  //---------------------------------------------------------------------EDIT PK

  const handleEditPokemon = async (Pk: EditPkFormValues) => {
    if (isTransitionUi) return;
    const UIPk: TPokemon = {
      id: Pk.Id,
      ball: Pk.Ball,
      species: Pk.Pokemon,
      name: Pk.Name,
      type: Pk.Type as Element[],
      exp: Pk.Xp,
      sprite: Pk.Sprite,
      order: Pk.Order,
    };
    startEditTransition(() => {
      setOptimisticLineup({ action: "edit", payload: UIPk });
    });

    const error = await EditPokemon(
      !badServer ? Pk : "invalid-id-to-test-error"
    );
    if (error) {
      toast.error("Failed to edit Pokémon on server. .");
      return;
    }
    toast.success("Pokémon edited on server");
  };

  //---------------------------------------------------------------------DELETE PK

  const handleDeletePokemon = async (id: string) => {
    if (isTransitionUi) return;
    startDeletePkTransition(() => {
      setOptimisticLineup({ action: "delete", payload: { id: id } });
    });
    setLineupRearrange(optimisticLineUp);
    const error = await DeletePokemon(
      !badServer ? id : "invalid-id-to-test-error"
    );
    if (error) {
      toast.error("Failed to delete Pokémon on server. ");
      return;
    }
    toast.success(`Deleted Pokémon on server. `);
  };

  //---------------------------------------------------------------------SIGN UP
  const handleSignUp = async (data: unknown) => {
    setTrainer(data as TTrainer);
    const error = await AddTrainer(data);
    if (error) {
      toast.error("Failed to sign up." + error.message);
      return;
    } else {
      toast.success("Signing up..." + (data as TTrainer).name);
    }
  };

  const handleSignOut = () => {
    if (isTransitionUi) return;
    startSignOutTransition(() => {
      setTrainer(null);
    });
    toast.success("Signed out");
  };

  const handleSignIn = (trainer: TTrainer) => {
    toast.success("Welcome back, " + trainer.name + "!");
    setTrainer(trainer);
  };

  //-------------------------------------------------------------- manual server disconnect

  const handleToggleBadServer = () => {
    setBadServer((prev) => !prev);
  };

  return (
    <TrainerContext.Provider
      value={{
        trainer,
        setTrainer,
        lineUp: slots,
        handleReorder,
        slots,
        ballEdit,
        ballShiftMode,
        isReordering,
        handleToggleReorder,
        handleBallClick,
        handleSignUp,
        ballLayoutEnabled,
        handleAddPokemon,
        handleEditPokemon,
        handleDeletePokemon,
        handleSignOut,
        handleSignIn,
        handleToggleBadServer,
        badServer,
        uiLineup,
        isTransitionUi,
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
}
//--------------------------------------------------------------Safe Context Hook
export function useTrainerContext() {
  const context = useContext(TrainerContext);
  if (!context)
    throw new Error(
      "useTrainerContext must be used within TrainerContextProvider"
    );
  return context;
}

//-----------------------------------------------------------------------Context

export const TrainerContext = createContext<TrainerContextType | null>(null);

//--------------------------------------------------------------------------Types

type TrainerContextType = {
  trainer: TTrainer | null;
  setTrainer: React.Dispatch<React.SetStateAction<TTrainer | null>>;
  lineUp: (
    | TPokemon
    | {
        id: string;
        name: string;
      }
  )[];
  slots: {
    id: string;
    name: string;
    empty: boolean;
  }[];
  ballEdit: number | null;
  ballShiftMode: "select" | "shift";
  isReordering: boolean;
  handleReorder: (fromIndex: number, toIndex: number) => void;
  handleBallClick?: (selectedBallIndex?: number) => void;
  handleToggleReorder?: () => void;
  ballLayoutEnabled?: boolean;
  handleAddPokemon?: (
    Pk: AddPkFormValues
  ) => Promise<void | { success: true; data: unknown } | undefined>;
  handleEditPokemon?: (
    Pk: EditPkFormValues
  ) => Promise<void | { success: true; data: unknown } | undefined>;
  handleDeletePokemon?: (id: string) => Promise<void>;
  handleSignUp: (data: unknown) => Promise<void>;
  handleSignOut: () => void;
  handleSignIn: (trainer: TTrainer) => void;
  handleToggleBadServer: () => void;
  badServer: boolean;
  uiLineup: TLineUp;
  isTransitionUi: boolean;
};
