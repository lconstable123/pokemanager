"use client";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormErrorMessage from "./form-error-message";
import { Input } from "@/components/ui/input";
import SubmitButton from "./submit-button";
import { EditPkFormSchema, EditPkFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Pokeball from "./pokeball";
import DeleteButton from "./delete-button";
import {
  FormHeader,
  FormLabel,
  PokeImageField,
  VertFields,
} from "./pkForm-elements";
import { PkDropdownAndModal } from "@/components/ui/Pk-dropdown";
import { flushSync } from "react-dom";
import { useDexContext } from "@/lib/contexts/DexContext";
import { UseFetchPkImg } from "@/lib/useFetchPkDetails";

export function EditPkModal() {
  //---------------------------------------------------------------------------------derived states

  const { trainer, handleEditPokemon, handleDeletePokemon } =
    useTrainerContext();

  const {
    EditPkModalopen,
    setEditPkModalOpen,
    selectedPk,
    setSelectedPk,
    evolutions,
    isInspectingLineup,
    setIsInspectingLineup,
  } = usePokeAppContext();

  const { selectedDexPk, setSelectedDexPk, isLoadingEvolutions } =
    useDexContext();

  const { loadingImage, DexPrevImg, elements, handleImageReset } =
    UseFetchPkImg(selectedDexPk);

  //-------------------------------------------------------------------------------- local states

  const [choosePkModalOpen, setChoosePkModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  //-------------------------------------------------------------------------------- form
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    watch,
    control,
    formState: { isSubmitting, errors },
  } = useForm<EditPkFormValues>({
    resolver: zodResolver(EditPkFormSchema),
    defaultValues: {
      Name: selectedPk?.name || "unknown", // prefill with selectedPk name
      Xp: selectedPk?.exp || 0,
      Pokemon: "",
      Sprite: selectedPk?.sprite || "",
    },
  });

  //--------------------------------------------------------------------------------------event handlers

  const handlePkModalToggleOpen = () => {
    setChoosePkModalOpen((prev) => !prev);
  };
  const handlePkModalOpenChange = (newOpen: boolean) => {
    setChoosePkModalOpen(newOpen);
  };

  const updateField = (field: keyof EditPkFormValues, value: any) => {
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onFormSubmission = async () => {
    flushSync(() => {
      handleDeselectPk();
      setEditPkModalOpen(false);
    });
    setEditPkModalOpen(false);
  };

  const handleDeselectPk = () => {
    // toast.success("deselecting pk");
    handleImageReset();
    setSelectedPk(null);
    setSelectedDexPk(null);
  };

  //---------------------------------------------------------effects

  //update pokeDex Api on evolution selection change

  const watchedPokemon = watch("Pokemon");

  useEffect(() => {
    if (watchedPokemon.length === 0) return;
    setSelectedDexPk(watchedPokemon);
  }, [watchedPokemon]);

  //update form fields on global selection change

  useEffect(() => {
    updateField("Name", selectedPk?.name || "unknown");
    updateField("Xp", selectedPk?.exp || 0);
    updateField("Pokemon", selectedPk?.species || "");
    updateField("Type", selectedPk?.type || [""]);
    updateField("Trainer", trainer?.id || "");
    updateField("Sprite", selectedPk?.sprite || "");
    updateField("Id", selectedPk?.id || "");
    updateField("Ball", selectedPk?.ball || "");
    updateField("Type", selectedPk?.type || []);
  }, [selectedPk]);

  //update image field on Pokedex fetch

  useEffect(() => {
    updateField("Sprite", DexPrevImg || selectedPk?.sprite);
  }, [DexPrevImg]);

  //---------------------------------------------------------jsx

  return (
    <DialogWindowStyle
      AddPkModalopen={EditPkModalopen}
      setAddPkModalOpen={(e) => {
        handleDeselectPk();
        setEditPkModalOpen(e);
      }}
      isSearchOpen={isSearchOpen}
    >
      <form
        className=" items-center flex flex-col justify-center"
        action={async () => {
          const pokeData1 = getValues();
          console.log(pokeData1);
          updateField("Order", selectedPk?.order || 0);
          console.log("order " + (selectedPk?.order || 0));
          const result = await trigger();
          if (!result) {
            toast.error("Please fix the errors.");
            console.log("Zod validation failed");
            console.log(errors);
            toast.error("Validation failed. Check form fields.");
            return;
          }
          const pokeData = getValues();
          console.log(pokeData);
          handleImageReset();
          await onFormSubmission?.();
          await handleEditPokemon?.(pokeData);
        }}
      >
        <div className="gap-y-0 items-center w-60 mb-5 flex flex-col flex-grow">
          <div className={`pt-4 w-full h-20 relative`}>
            <FormLabel lblfor="pk" header="Evolve Pokemon" />
            <Controller
              name="Pokemon"
              control={control}
              render={({ field }) => (
                <PkDropdownAndModal
                  options={evolutions}
                  width="full"
                  selected={field.value}
                  onSelect={(e) => {
                    setIsInspectingLineup(false);
                    field.onChange(e);
                  }}
                  userJourney={
                    isLoadingEvolutions
                      ? "loading"
                      : evolutions.length <= 0
                      ? "no-evolution"
                      : "addpk"
                  }
                  OpenStatus={choosePkModalOpen}
                  handletoggleOpen={handlePkModalToggleOpen}
                  handleOpenChange={handlePkModalOpenChange}
                  type={"evolution"}
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
            image={isInspectingLineup ? selectedPk?.sprite : DexPrevImg || ""}
            isImageLoaded={isInspectingLineup ? true : loadingImage}
            elements={
              isInspectingLineup ? selectedPk?.type || [] : elements || []
            }
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
          <DeleteButton
            handleDelete={async () => {
              const pokeData = getValues();
              await onFormSubmission?.();
              await handleDeletePokemon?.(pokeData.Id);
            }}
          />
          <SubmitButton
            onSubmit={() => {}}
            ball="02"
            name="update"
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
  const descriptionId =
    mode === "add" ? "add-pokemon-modal" : "edit-pokemon-modal";
  return (
    <Dialog open={AddPkModalopen} onOpenChange={setAddPkModalOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={cn(
          "border-3  border-black bg-blue-50 w-100 duration-0 flex flex-col items-center gap-y-0! noSelect pb-3",
          "h-[510px]"
        )}
      >
        <div className="absolute bottom-0 ditheredGrad w-full h-20 -z-10 opacity-15 " />
        <div className="absolute top-0 rotate-180 ditheredGrad w-full h-20 -z-10 opacity-15 " />
        <FormHeader mode={"edit"} />
        <DialogDescription id={descriptionId} className="sr-only">
          Edit the selected Pokémon's details.
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
};
