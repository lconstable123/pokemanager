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
import { MultiSelectDropdown } from "@/components/ui/dropdown";
import { AddPkFormSchema, AddPkFormValues } from "@/lib/schemas";
import {
  cn,
  generateRandomName,
  getElementSprite,
  RomanToInt,
} from "@/lib/utils";
import { elmOptions, genOptions, testPokeData } from "@/lib/data";
import { MultiSelectBallDropdown } from "@/components/ui/dropdown-ball";
import { MultiSelectFilterDropdown } from "@/components/ui/dropdown-elements";
import clsx from "clsx";
import toast from "react-hot-toast";
import { motion, useAnimation } from "framer-motion";
import { FaCaretDown } from "react-icons/fa";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleAddPokemon } from "@/lib/actions";
import PlaceholderPk from "./placeholder-pk";
import { set } from "zod";
import { usePreloadImage } from "@/lib/hooks";
import { select } from "framer-motion/client";
import { UseFetchPkImg } from "@/lib/useFetchPkDetails";
import { Element } from "@/lib/types";

// import { Popover } from "@radix-ui/react-popover";
export function AddPkModal({ mode }: { mode?: "add" | "edit" }) {
  const { trainer } = useTrainerContext();
  const {
    PkDropdownEntries,
    handleSetGenrationFilter,
    typeFilter,
    setTypeFilter,
    generationFilter,
    selectedDexPk,
    setSelectedDexPk,
    AddPkModalopen,
    setAddPkModalOpen,
  } = usePokeAppContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // handleAnimateOpen();
    } else {
      // handleAnimateClose();
    }
  };

  const handleModal = () => {
    toast.success("Closed");
    setIsSearchOpen(false);
    setSelectedDexPk(null);
    setAddPkModalOpen(!AddPkModalopen);
  };

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<AddPkFormValues>({
    resolver: zodResolver(AddPkFormSchema),
    defaultValues: {
      Name: "",
      Xp: 12,
      Pokemon: "",
      Ball: "02",
    },
  });
  const controls = useAnimation();

  const watchedPokemon = watch("Pokemon");
  useEffect(() => {
    setSelectedDexPk(watchedPokemon);
    setValue("Name", generateRandomName());
  }, [watchedPokemon]);

  const handleAnimateOpen = () => {
    controls.start({ height: "200px", transition: { duration: 0.3 } });
  };
  const handleAnimateClose = () => {
    controls.start({ height: 0, transition: { duration: 0.3 } });
  };

  const onFormSubmission = async () => {};

  const { loadingImage, DexPrevImg, elements } = UseFetchPkImg(selectedDexPk);

  //Choose Pk Modal
  const [choosePkModalOpen, setChoosePkModalOpen] = useState<boolean>(false);
  const handlePkModalToggleOpen = () => {
    setChoosePkModalOpen((prev) => !prev);
  };
  const handlePkModalOpenChange = (newOpen: boolean) => {
    setChoosePkModalOpen(newOpen);
  };
  const handleClickImageField = () => {
    setChoosePkModalOpen(true);
  };

  return (
    <DialogWindowStyle
      mode={mode}
      AddPkModalopen={AddPkModalopen}
      setAddPkModalOpen={handleModal}
      isSearchOpen={isSearchOpen}
    >
      <form
        className=" items-center flex flex-col justify-center"
        action={async () => {
          setValue("Type", elements);
          setValue("Sprite", DexPrevImg || "");

          const result = await trigger();
          if (!result) return;
          onFormSubmission?.();
          const pokeData = getValues();
          // toast.success("Added " + pokeData.Pokemon + " to your team!");
          await handleAddPokemon(pokeData);
          toast.success("DONE");
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
              <div className={cn("mt-5 w-full transition-all duration-400")}>
                <Border />
              </div>
            </motion.div>
          )}

          <ImageField
            clickhandle={handleClickImageField}
            image={DexPrevImg}
            isImageLoaded={loadingImage}
            elements={elements}
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
          </ImageField>
          <div className={`py-2 h-18  w-full relative`}>
            <FormLabel lblfor="pk" header="Add Pokemon" />
            <Controller
              name="Pokemon"
              control={control}
              rules={{ required: "Please select a Pokemon" }}
              render={({ field }) => (
                <MultiSelectDropdown
                  options={[...PkDropdownEntries]}
                  width="full"
                  selected={field.value}
                  onSelect={field.onChange}
                  OpenStatus={choosePkModalOpen}
                  handletoggleOpen={handlePkModalToggleOpen}
                  handleOpenChange={handlePkModalOpenChange}
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
        </div>
        <SubmitButton
          onSubmit={() => {}}
          ball="02"
          name="Add"
          ballPadding="20px"
        />
      </form>
    </DialogWindowStyle>
  );
}

const Border = () => {
  return <hr className="relative border-1 w-full " />;
};
//------------------------------------------------------------------------------------
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
          "w-100 duration-0 flex flex-col items-center gap-y-0! noSelect pb-1",
          isSearchOpen ? "h-[600px]" : "h-[520px]"
        )}
      >
        <FormHeader mode={mode} />
        {children}
      </DialogContent>
    </Dialog>
  );
};

const VertFields = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-row gap-x-3 flex w-full items-center justify-center">
      {children}
    </div>
  );
};

const FormLabel = ({ lblfor, header }: { lblfor: string; header: string }) => {
  return (
    <Label className="" htmlFor={lblfor}>
      <h3 className="text-md font-bold text-[10pt] tracking-wider my-0 ">
        {header}
      </h3>
    </Label>
  );
};

const ImageField = ({
  children,
  image,
  isImageLoaded,
  elements,
  clickhandle,
}: {
  children: React.ReactNode;
  image?: string | null;
  isImageLoaded: boolean;
  elements: string[];
  clickhandle: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-6 flex justify-center relative  h-full "
    >
      <div className="absolute -left-5 top-0 z-10">{children}</div>

      <div className="absolute -right-20 -top-2 w-20 h-20">
        {isImageLoaded && elements && <PKCardTypes types={elements} />}
      </div>
      <div
        onClick={() => {
          clickhandle();
        }}
        className="relative mt-1 border-0 border-gray-700 overflow-hidden w-50 h-50 rounded-full bg-gray-300"
      >
        {!isImageLoaded && (
          <PlaceholderPk text={"Add a pokemon"} loading={!isImageLoaded} />
        )}
        {isImageLoaded && image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute w-60 h-60  left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <img
              src={image}
              alt={"pokemon sprite"}
              className={`
            scale-102 hover:scale-110 
           w-full h-full cursor-pointer absolute z-3 user-select-none pixelImage `}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const SearchFilterButton = ({
  handleClick,
  isSearchOpen,
}: {
  handleClick: () => void;
  isSearchOpen: boolean;
}) => {
  return (
    <div
      onClick={handleClick}
      className="group relative mt-6 mb-0 w-full px-10 flex items-center cursor-pointer"
    >
      <Border />
      <h3 className=" transition-all duration-100 absolute top-0 group-hover:scale-105 scale-100 -translate-y-1/2 left-1/2 -translate-x-1/2 text-[9pt] bg-white border-2 rounded-full px-2 py-1 font-bold">
        Search Filter
      </h3>
      <FaCaretDown
        className={cn(
          "transition-all duration-100  group-hover:scale-105 scale-100 z-30 w-4 h-4 absolute right-9 top-1/2 -translate-y-1/2 border-2 border-black rounded-full bg-white ",
          isSearchOpen ? "rotate-180" : "rotate-0"
        )}
      />
      <FaCaretDown
        className={cn(
          "transition-all duration-100  group-hover:scale-105 scale-100 z-30 w-4 h-4 absolute left-9 top-1/2 -translate-y-1/2 border-2 border-black rounded-full bg-white ",
          isSearchOpen ? "rotate-180" : "rotate-0"
        )}
      />
    </div>
  );
};

const FormHeader = ({ mode }: { mode?: "add" | "edit" }) => {
  return (
    <>
      <DialogHeader></DialogHeader>
      <DialogTitle className="hidden">Trainer Info</DialogTitle>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-[15pt]! Text-primary! font-semibold!"
      >
        <h1>{mode === "edit" ? "Edit Pokemon" : "Add Pokemon"}</h1>
      </motion.div>
    </>
  );
};

export function PKCardTypes({ types }: { types: string[] }) {
  return (
    <div className="mt-1 flex flex-col gap-0 ">
      {types.map((type, index) => (
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            duration: 0.2,
            delay: 0.1 + index * 0.05,
          }}
          key={index}
          src={getElementSprite(type as Element)}
          alt={type}
          className="w-8 h-8 object-cover z-3 user-select-none pixelImage pointer-events-none"
        />
      ))}
    </div>
  );
}
