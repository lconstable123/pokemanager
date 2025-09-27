"use client";
import React, {
  createContext,
  useContext,
  useState,
  useOptimistic,
  useTransition,
  useEffect,
  use,
  useMemo,
} from "react";
import {
  Element,
  ServerTrainerWithLineup,
  TLineUp,
  TPokemon,
  TTrainer,
} from "../types";
import toast from "react-hot-toast";
import { initialTrainerData } from "../data";
import { AddPkFormValues, EditPkFormValues } from "../schemas";
import { AddPokemon, AddTrainer, DeletePokemon, EditPokemon } from "../actions";
import useBallReorder from "../useBallReorder";
import { v4 as uuidv4 } from "uuid";
import { start } from "repl";
import { set } from "zod";

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
  // lineupRearrange: TLineUp;
  uiLineup: TLineUp;
  // setLineupRearrange: React.Dispatch<React.SetStateAction<TLineUp>>;
};
export type OptimisticAction =
  | { action: "add"; payload: TPokemon }
  | { action: "edit"; payload: Partial<TPokemon> & { id: string } }
  | { action: "delete"; payload: { id: string } }
  | { action: "rearrange"; payload: { fromIndex: number; toIndex: number } }
  | { action: "clear"; payload: null }
  | { action: "commit"; payload: TLineUp };
//-----------------
export const TrainerContext = createContext<TrainerContextType | null>(null);

export default function TrainerContextProvider({
  children,
  trainerFromServer,
}: // initialTrainerData = [] as TLineUp,
{
  children: React.ReactNode;
  trainerFromServer: ServerTrainerWithLineup | null;
}) {
  //------------------------------------------------------------------stores

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
  // const [serverLineUp, setServerLineUp] = useState<TLineUp>(initialLineUp);
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
        // console.log("rearranging", payload.fromIndex, payload.toIndex);
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

  const [lineupRearrange, setLineupRearrange] =
    useState<TLineUp>(optimisticLineUp);
  //---------------------------------------------------------------------Optimistic UI Trainer

  const handleCalculateSlots = (lineUp: TPokemon[]) => {
    return Array.from({ length: 6 }, (_, i) =>
      lineUp[i]
        ? { id: lineUp[i].id, name: lineUp[i].name, empty: false }
        : { id: "empty" + (i + 1), name: "Empty Slot " + (i + 1), empty: true }
    );
  };

  // lineup that is rearranged on front-end and manually synced to server
  // const [lineupRearrange, setLineupRearrange] =
  //   useState<TLineUp>(initialLineUp);

  // useEffect(() => {
  //   toast.success("flag");
  // }, [lineupRearrange]);

  // derive the slots from the optimisticLineUp

  const [isPending, startTransition] = useTransition();
  const [isPendingClear, startTransitionClear] = useTransition();
  const [addPkTransition, startAddPkTransition] = useTransition();

  //---------------------------------------------------------------------Ball Logic
  const {
    ballEdit,
    handleReorder,
    ballShiftMode,
    isReordering,
    handleToggleReorder,
    handleBallClick,
    ballLayoutEnabled,
    uiLineup,
  } = useBallReorder({
    //ball reorder inputs

    optimisticLineUp,
    setOptimisticLineup,
    badServer,
    lineupRearrange,
    setLineupRearrange,
  });

  const slots = handleCalculateSlots(uiLineup);
  //---------------------------------------------------------------------ADD PK

  const handleAddPokemon = async (Pk: AddPkFormValues) => {
    const Id = uuidv4();
    const UIPk: TPokemon = {
      id: Id,
      ball: Pk.Ball,
      species: Pk.Pokemon,
      name: Pk.Name,
      type: Pk.Type as Element[],
      exp: Pk.Xp,
      sprite: Pk.Sprite,
    };
    startAddPkTransition(() => {
      setOptimisticLineup({ action: "add", payload: UIPk });
    });
    // handleUpdateDynamicLineup(optimisticLineUp);
    setLineupRearrange(optimisticLineUp);
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
    const UIPk: TPokemon = {
      id: Pk.Id,
      ball: Pk.Ball,
      species: Pk.Pokemon,
      name: Pk.Name,
      type: Pk.Type as Element[],
      exp: Pk.Xp,
      sprite: Pk.Sprite,
    };
    setOptimisticLineup({ action: "edit", payload: UIPk });
    setLineupRearrange(optimisticLineUp);
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
    startTransition(() => {
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
    startTransitionClear(() => {
      setTrainer(null);
    });
    toast.success("Signed out");
  };

  const handleSignIn = (trainer: TTrainer) => {
    toast.success("Welcome back, " + trainer.name + "!");
    setTrainer(trainer);
    // setServerLineUp(trainer.lineup);
  };

  const handleToggleBadServer = () => {
    setBadServer((prev) => !prev);
  };

  //     useEffect(() => {
  //   if (!optimisticLineUp.length && trainerFromServer?.lineup) {
  //     setOptimisticLineup({
  //       action: "replace",
  //       payload: trainerFromServer.lineup,
  //     });
  //   }
  // }, []);

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
        // lineupRearrange,
        // setLineupRearrange,
        uiLineup,
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
}

export function useTrainerContext() {
  const context = useContext(TrainerContext);
  if (!context)
    throw new Error(
      "useTrainerContext must be used within TrainerContextProvider"
    );
  return context;
}
