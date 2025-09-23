"use client";
import React, {
  createContext,
  useContext,
  useState,
  useOptimistic,
  useTransition,
  useEffect,
} from "react";
import { Element, TLineUp, TPokemon, TTrainer } from "../types";
import toast from "react-hot-toast";
import { initialTrainerData } from "../data";
import { AddPkFormValues, EditPkFormValues } from "../schemas";
import { AddPokemon, EditPokemon } from "../actions";
import useBallReorder from "../useBallReorder";
import { v4 as uuidv4 } from "uuid";
type TrainerContextType = {
  trainer: TTrainer;
  lineUp: TLineUp;
  slots: string[];
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
  handleDeletePokemon?: (Pk: EditPkFormValues) => Promise<void>;
};
export type OptimisticAction =
  | { action: "add"; payload: TPokemon }
  | { action: "edit"; payload: Partial<TPokemon> & { id: string } }
  | { action: "delete"; payload: { id: string } }
  | { action: "rearrange"; payload: { fromIndex: number; toIndex: number } };
//-----------------
export const TrainerContext = createContext<TrainerContextType | null>(null);

export default function TrainerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //------------------------------------------------------------------stores
  const [serverLineUp, setServerLineUp] = useState<TLineUp>(
    initialTrainerData.lineup.slice(0, 4)
  );

  //---------------------------------------------------------------------Optimistic UI
  const [optimisticLineUp, setOptimisticLineup] = useOptimistic<
    TPokemon[],
    OptimisticAction
  >(serverLineUp, (state, { action, payload }) => {
    switch (action) {
      case "add":
        const alreadyExists = state.find((pk) => pk.id === payload.id);
        if (alreadyExists) {
          // toast.error("Pokémon with this ID already exists.");
          return state;
        } else {
          return [...state, payload];
        }
      case "edit":
        return state.map((pk) =>
          pk.id === payload.id ? { ...pk, ...payload } : pk
        );
      case "delete":
        return state.filter((pk) => pk.id !== payload.id);
      case "rearrange": {
        const updated = [...state];
        const [moved] = updated.splice(payload.fromIndex, 1);
        updated.splice(payload.toIndex, 0, moved);
        return updated;
      }
      default:
        return state;
    }
  });
  const handleCalculateSlots = () => {
    return Array.from({ length: 6 }, (_, i) =>
      optimisticLineUp[i] ? optimisticLineUp[i].id : "empty" + (i + 1)
    );
  };

  const [isPending, startTransition] = useTransition();
  const slots = handleCalculateSlots();

  //---------------------------------------------------------------------Ball Logic
  const {
    ballEdit,
    handleReorder,
    ballShiftMode,
    isReordering,
    handleToggleReorder,
    handleBallClick,
    ballLayoutEnabled,
  } = useBallReorder({
    setOptimisticLineup,
    setServerLineUp,
    optimisticLineUp,
  });
  //---------------------------------------------------------------------ADD
  const handleAddPokemon = async (Pk: AddPkFormValues) => {
    const Id = uuidv4();
    toast.success(Id);
    const UIPk: TPokemon = {
      id: Id,
      ball: Pk.Ball,
      species: Pk.Pokemon,
      name: Pk.Name,
      type: Pk.Type as Element[],
      exp: Pk.Xp,
      sprite: Pk.Sprite,
    };
    toast.success("adding " + Pk?.Pokemon + "!!!");
    setOptimisticLineup({ action: "add", payload: UIPk });
    const error = await AddPokemon(Pk);
    setServerLineUp((prev) => [...prev, UIPk]);

    if (error) {
      toast.error("Failed to add Pokémon. Check console for details.");
      console.log(error);
      return;
    }
    toast.success("Pokémon added successfully!");
  };
  //---------------------------------------------------------------------EDIT
  const handleEditPokemon = async (Pk: EditPkFormValues) => {
    // toast.success("editing " + Pk?.Id + "!!!");
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
    const error = await EditPokemon(Pk);
    setServerLineUp((prev) =>
      prev.map((pk) => (pk.id === UIPk.id ? { ...pk, ...UIPk } : pk))
    );
    if (error) {
      toast.error("Failed to edit Pokémon. Check console for details.");
      console.log(error);
      return;
    }
    // toast.success("Pokémon edited successfully!");
  };
  //---------------------------------------------------------------------DELETE
  const handleDeletePokemon = async (Pk: EditPkFormValues) => {
    startTransition(() => {
      setOptimisticLineup({ action: "delete", payload: { id: Pk.Id } });
      // toast.success("Editing Pokémon...");
      setServerLineUp((prev) => prev.filter((pk) => pk.id !== Pk.Id));
    });
    // const error = await DeletePokemon(data);
    // if (error) {
    //   toast.error("Failed to delete Pokémon. Check console for details.");
    //   console.log(error);
    //   return;
    // }
    // toast.success("Pokémon deleted successfully!");
  };

  return (
    <TrainerContext.Provider
      value={{
        trainer: initialTrainerData,
        lineUp: optimisticLineUp,
        handleReorder,
        slots,
        ballEdit,
        ballShiftMode,
        isReordering,
        handleToggleReorder,
        handleBallClick,

        ballLayoutEnabled,
        handleAddPokemon,
        handleEditPokemon,
        handleDeletePokemon,
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
