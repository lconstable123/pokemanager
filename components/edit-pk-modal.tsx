"use client";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import React, { use, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import * as Popover from "@radix-ui/react-popover";
import { Label } from "@radix-ui/react-label";
import FormErrorMessage from "./form-error-message";
import { Input } from "@/components/ui/input";
import SubmitButton from "./submit-button";

import { EditPkFormSchema, EditPkFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { testPokeData } from "@/lib/data";

import toast from "react-hot-toast";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleAddPokemon } from "@/lib/actions";
import Pokeball from "./pokeball";

import DeleteButton from "./delete-button";
import {
  FormHeader,
  FormLabel,
  PokeImageField,
  VertFields,
} from "./pkForm-elements";
import { PkDropdownAndModal } from "@/components/ui/Pk-dropdown";

// import { Popover } from "@radix-ui/react-popover";
export function EditPkModal() {
  //-------------------------derived states
  const { trainer } = useTrainerContext();
  const { EditPkModalopen, setEditPkModalOpen, selectedPk } =
    usePokeAppContext();

  //--------------------------- local states
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<EditPkFormValues>({
    resolver: zodResolver(EditPkFormSchema),
    defaultValues: {
      Name: selectedPk?.name || "unknown", // prefill with selectedPk name
      Xp: selectedPk?.exp || 0,
      Pokemon: "Lapras",
    },
  });

  //-------------------------event handlers
  const updateField = (field: keyof EditPkFormValues, value: any) => {
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  const onFormSubmission = async () => {};
  //effects
  useEffect(() => {
    updateField("Name", selectedPk?.name || "unknown");
    updateField("Xp", selectedPk?.exp || 0);
    updateField("Pokemon", selectedPk?.species || "cannot evolve");
    updateField("Type", selectedPk?.type || [""]);
    updateField("Trainer", trainer?.id || "");
    updateField("Sprite", selectedPk?.sprite || "");
    updateField("id", selectedPk?.id || "");
  }, [selectedPk]);

  return (
    <DialogWindowStyle
      AddPkModalopen={EditPkModalopen}
      setAddPkModalOpen={setEditPkModalOpen}
      isSearchOpen={isSearchOpen}
    >
      <form
        className=" items-center flex flex-col justify-center"
        action={async () => {
          const result = await trigger();
          if (!result) return;
          onFormSubmission?.();
          const pokeData = getValues();
          toast.success("Added " + pokeData.Pokemon + " to your team!");
          await handleAddPokemon(pokeData);
          toast.success("DONE");
        }}
      >
        <div className="gap-y-0 items-center w-60 mb-5 flex flex-col flex-grow">
          <div className={`pt-4 w-full h-20 relative`}>
            <FormLabel lblfor="pk" header="Evolve Pokemon" />
            <Controller
              name="Pokemon"
              control={control}
              rules={{ required: "Please select a Pokemon" }}
              render={({ field }) => (
                <PkDropdownAndModal
                  options={[...testPokeData]}
                  width="full"
                  selected={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
            {errors.Pokemon && (
              <FormErrorMessage
                message={errors?.Pokemon?.message || ""}
                pos="right"
              />
            )}
          </div>

          <PokeImageField
            clickhandle={() => {}}
            image={selectedPk?.sprite || ""}
            isImageLoaded={true}
            elements={selectedPk?.type || []}
            userJourney={"addpk"}
          >
            <Pokeball type={selectedPk?.ball || "05"} size={30} />
          </PokeImageField>
          <VertFields>
            <div className="relative w-130">
              <FormLabel lblfor="name" header="Rename" />
              <Input
                {...register("Name", { required: true })}
                id="Rename"
                defaultValue={getValues("Name") as string}
              />
              {errors.Name && (
                <FormErrorMessage message={errors?.Name?.message || ""} />
              )}
            </div>
            <div className="relative w-full">
              <FormLabel lblfor="xp" header="Xp+" />
              <Input
                {...register("Xp", { valueAsNumber: true })}
                placeholder="Xp"
                id="Xp"
                type="number"
                defaultValue={getValues("Xp") as number}
              />
              {errors.Xp && (
                <FormErrorMessage message={errors?.Xp?.message || ""} />
              )}
            </div>
          </VertFields>
        </div>
        <div className="flex gap-3">
          <DeleteButton handleDelete={() => {}} />
          <SubmitButton
            onSubmit={() => {}}
            ball="02"
            name="delete"
            ballPadding="20px"
            style="noball"
            type="submit"
            colorStyle="submit"
          />
        </div>
      </form>
    </DialogWindowStyle>
  );
}

const DialogWindowStyle = ({
  children,
  AddPkModalopen,
  setAddPkModalOpen,
  isSearchOpen,
  mode,
}: {
  children: React.ReactNode;
  AddPkModalopen: boolean;
  setAddPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchOpen: boolean;
  mode?: "add" | "edit";
}) => {
  return (
    <Dialog open={AddPkModalopen} onOpenChange={setAddPkModalOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent
        aria-describedby="add-pokemon-modal"
        tabIndex={-1}
        className={cn(
          "w-100 duration-0 flex flex-col items-center gap-y-0! noSelect pb-3",
          "h-[510px]"
        )}
      >
        <FormHeader mode={mode} />
        {children}
      </DialogContent>
    </Dialog>
  );
};
