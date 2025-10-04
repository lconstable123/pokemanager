"use client";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import FormErrorMessage from "./form-error-message";
import { Input } from "@/components/ui/input";
import SubmitButton from "./submit-button";

import { AddPkFormSchema, AddPkFormValues } from "@/lib/schemas";
import { cn, generateRandomBall, generateRandomName } from "@/lib/utils";
import { elmOptions, genOptions, testPokeData } from "@/lib/data";
import { MultiSelectBallDropdown } from "@/components/ui/dropdown-ball";
import { MultiSelectFilterDropdown } from "@/components/ui/dropdown-elements";
import clsx from "clsx";
import { motion, useAnimation } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Border,
  FormHeader,
  FormLabel,
  PokeImageField,
  SearchFilterButton,
  VertFields,
} from "./pkForm-elements";
import { useDexContext } from "@/lib/contexts/DexContext";
import { PkDropdownAndModal } from "@/components/ui/Pk-dropdown";
import { flushSync } from "react-dom";

export function AddPkModal({ mode }: { mode?: "add" | "edit" }) {
  //------------------------------------------------------------------------ derived states

  const { handleAddPokemon, uiLineup } = useTrainerContext();

  const { AddPkModalopen, setAddPkModalOpen, setSelectedPk, trainer } =
    usePokeAppContext();

  const {
    PkDropdownEntries,
    handleSetGenrationFilter,
    typeFilter,
    setTypeFilter,
    generationFilter,
    setSelectedDexPk,
    loadingImage,
    DexPrevImg,
    DexPrevBackImg,
    elements,
    handleImageReset,
  } = useDexContext();

  //-------------------------------------------------------------------------- local states

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [choosePkModalOpen, setChoosePkModalOpen] = useState<boolean>(false);
  const [userJourney, setUserJourney] = useState<
    "initial" | "addpk" | "addname"
  >("initial");

  //------------------------------------------------------------------------------form state

  const {
    register,

    setValue,
    trigger,
    getValues,
    control,
    watch,
    resetField,
    formState: { dirtyFields, errors },
  } = useForm<AddPkFormValues>({
    resolver: zodResolver(AddPkFormSchema),
    defaultValues: {
      Name: "",
      Xp: 12,
      Pokemon: "",
      Ball: generateRandomBall(),
    },
  });

  //----------------------------------------------------------------------handles

  const handleSearchToggle = () => {
    updateField("Ball", generateRandomBall());
    setIsSearchOpen(!isSearchOpen);
  };

  // When modal is closed, reset everything
  const handleModal = () => {
    resetField("Ball");
    updateField("Ball", generateRandomBall());
    handleDeselectPk();
  };

  const onFormSubmission = async () => {
    flushSync(() => {
      setAddPkModalOpen(false);
    });
    // toast.success("closing modal");
  };

  // internal pk selection modal
  const handlePkModalToggleOpen = () => {
    updateField("Ball", generateRandomBall());
    setChoosePkModalOpen((prev) => !prev);
  };

  const handlePkModalOpenChange = (newOpen: boolean) => {
    updateField("Ball", generateRandomBall());
    setChoosePkModalOpen(newOpen);
  };

  // if image is selected open modal
  const handleClickImageField = () => {
    setChoosePkModalOpen(true);
  };

  const handleDeselectPk = () => {
    // toast.success("deselecting pk");
    resetField("Ball");
    setIsSearchOpen(false);
    setSelectedDexPk(null);
    setAddPkModalOpen(!AddPkModalopen);
    setValue("Pokemon", "");
    setUserJourney("initial");
    handleImageReset();
  };

  //-------------------------------------------------------------------------effects

  // When pokemon is selected from dropdown, set random name and change journey to addname

  const watchedPokemon = watch("Pokemon");
  const updateField = (field: keyof AddPkFormValues, value: any) => {
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  useEffect(() => {
    if (watchedPokemon.length === 0) return;
    setSelectedDexPk(watchedPokemon);
    updateField("Name", generateRandomName());
    if (!dirtyFields.Ball) {
      updateField("Ball", generateRandomBall());
    }
    setUserJourney("addname");
  }, [watchedPokemon]);

  //---------------------------------------------------------jsx

  return (
    <DialogWindowStyle
      mode={mode}
      AddPkModalopen={AddPkModalopen}
      setAddPkModalOpen={handleModal}
      isSearchOpen={isSearchOpen}
      userJourney={userJourney}
    >
      <form
        className=" items-center flex flex-col justify-center"
        action={async () => {
          setValue("Type", elements);
          setValue("Sprite", DexPrevImg || "");
          setValue("SpriteBack", DexPrevBackImg || "");
          setValue("Trainer", trainer?.id || "");
          setValue("Order", uiLineup.length || 0);
          // toast.success(DexPrevBackImg);
          const pokeData = getValues();
          console.log(pokeData);
          const result = await trigger();
          if (!result) return;
          handleAddPokemon?.(pokeData);

          handleDeselectPk();
          onFormSubmission?.();
          // toast.success("Added " + pokeData.Pokemon + " to your team!");
        }}
      >
        <div className="gap-y-0 items-center w-60 mb-5 flex flex-col flex-grow">
          {mode == "add" && (
            <SearchFilterButton
              handleClick={handleSearchToggle}
              isSearchOpen={isSearchOpen}
            />
          )}
          {isSearchOpen && mode == "add" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={clsx(
                "w-full h-full px-2 pt-5 transition-all duration-400 overflow-hidden"
              )}
            >
              <VertFields>
                <div className="">
                  <FormLabel lblfor="gen" header="Generation" />
                  <MultiSelectFilterDropdown
                    options={[...genOptions]}
                    type="gen"
                    width="full"
                    cap={0}
                    selected={generationFilter}
                    onSelect={handleSetGenrationFilter}
                    handleSelect={handleClickImageField}
                  />
                </div>
                <div className="relative">
                  <FormLabel lblfor="elm" header="Type" />

                  <MultiSelectFilterDropdown
                    options={[...elmOptions]}
                    type="elm"
                    width="full"
                    selected={typeFilter}
                    onSelect={setTypeFilter}
                  />
                </div>
              </VertFields>
              <div className={cn("mt-4 w-full transition-all duration-400")}>
                <Border />
              </div>
            </motion.div>
          )}

          <PokeImageField
            clickhandle={handleClickImageField}
            image={DexPrevImg}
            isUrlLoaded={loadingImage}
            elements={elements}
            userJourney={userJourney}
          >
            <Controller
              name="Ball"
              control={control}
              render={({ field }) => (
                <MultiSelectBallDropdown
                  options={[...elmOptions]}
                  width="full absolute left-0 top-0 "
                  selected={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
            {errors.Ball && (
              <FormErrorMessage message={errors?.Ball?.message || ""} />
            )}
          </PokeImageField>
          <div className={`py-2 h-17  w-full relative`}>
            <FormLabel lblfor="pk" header="Add Pokemon" />
            <Controller
              name="Pokemon"
              control={control}
              rules={{ required: "Please select a Pokemon" }}
              render={({ field }) => (
                <PkDropdownAndModal
                  options={[...PkDropdownEntries]}
                  width="full"
                  selected={field.value}
                  onSelect={field.onChange}
                  OpenStatus={choosePkModalOpen}
                  handletoggleOpen={handlePkModalToggleOpen}
                  handleOpenChange={handlePkModalOpenChange}
                  userJourney={userJourney}
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
          {/* <div>{DexPrevBackImg}</div> */}
          {userJourney === "addname" && (
            <VertFields>
              <div className="relative w-130">
                <FormLabel lblfor="name" header="Name" />

                <Input
                  {...register("Name", { required: true })}
                  placeholder="Name"
                  id="Name"
                />
                {errors.Name && (
                  <FormErrorMessage message={errors?.Name?.message || ""} />
                )}
              </div>
              <div className="relative w-full">
                <FormLabel lblfor="xp" header="Xp" />
                <Input
                  {...register("Xp", { valueAsNumber: true })}
                  placeholder="Xp"
                  id="Xp"
                  type="number"
                />
                {errors.Xp && (
                  <FormErrorMessage message={errors?.Xp?.message || ""} />
                )}
              </div>
            </VertFields>
          )}
        </div>
        {userJourney === "addname" && (
          <SubmitButton
            onSubmit={() => {}}
            ball="02"
            name="Add"
            ballPadding="20px"
            type="submit"
            colorStyle="submit"
          />
        )}
      </form>
    </DialogWindowStyle>
  );
}

//------------------------------------------------------------------------------------
const DialogWindowStyle = ({
  children,
  AddPkModalopen,
  setAddPkModalOpen,
  isSearchOpen,
  mode,
  userJourney,
}: {
  children: React.ReactNode;
  AddPkModalopen: boolean;
  setAddPkModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSearchOpen: boolean;
  mode?: "add" | "edit";
  userJourney?: "initial" | "addpk" | "addname";
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
          "w-100 border-3  border-blue-950 bg-blue-50 duration-0 flex flex-col items-center gap-y-0! noSelect pb-1",
          isSearchOpen
            ? userJourney === "initial"
              ? "h-[500px]"
              : "h-[620px]"
            : userJourney === "initial"
            ? "h-[400px]"
            : "h-[520px]"
        )}
      >
        <div className="absolute bottom-0 ditheredGrad w-full h-20 -z-10 opacity-15 " />
        <div className="absolute top-0 rotate-180 ditheredGrad w-full h-20 -z-10 opacity-15 " />
        <FormHeader mode={mode} />
        <DialogDescription id={descriptionId} className="sr-only">
          Add a new Pokémon to your team.
        </DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
};
