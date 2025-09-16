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
import { cn } from "@/lib/utils";
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
import Pokeball from "./pokeball";
import PlaceholderPk from "./placeholder-pk";
const pokemon = [
  {
    id: "#blast3",
    apiId: "9",
    ball: "04",
    species: "Blastoise",
    type: ["Water", "Electric"],
    sprite: "/placeholders/pokesprites/Blastoise.png",
  },
];

// import { Popover } from "@radix-ui/react-popover";
export function EditPkModal() {
  const { trainer } = useTrainerContext();
  const { EditPkModalopen, setEditPkModalOpen, selectedPk } =
    usePokeAppContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // handleAnimateOpen();
    } else {
      // handleAnimateClose();
    }
  };
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<AddPkFormValues>({
    resolver: zodResolver(AddPkFormSchema),
    defaultValues: {
      Name: selectedPk?.name || "unknown", // prefill with selectedPk name
      Xp: selectedPk?.exp || 0,
      // Gen: ["I"],
      // Type: ["Fire"],
      Pokemon: "lAPRAS",
      Ball: "02",
    },
  });
  useEffect(() => {
    updateField("Name", selectedPk?.name || "unknown");
    updateField("Xp", selectedPk?.exp || 0);
    updateField("Pokemon", selectedPk?.species || "cannot evolve");
    updateField("Ball", selectedPk?.ball || "05");
  }, [selectedPk]);
  const controls = useAnimation();
  const handleAnimateOpen = () => {
    controls.start({ height: "200px", transition: { duration: 0.3 } });
  };
  const handleAnimateClose = () => {
    controls.start({ height: 0, transition: { duration: 0.3 } });
  };
  const updateField = (field: keyof AddPkFormValues, value: any) => {
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };
  const onFormSubmission = async () => {};
  const [elements, setElements] = useState<string[]>([]);
  const [generations, setGenerations] = useState<string[]>([]);
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
          <div className={`pt-4 w-full relative`}>
            <FormLabel lblfor="pk" header="Evolve Pokemon" />
            <Controller
              name="Pokemon"
              control={control}
              rules={{ required: "Please select a Pokemon" }}
              render={({ field }) => (
                <MultiSelectDropdown
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
          <ImageField>
            <Pokeball type={selectedPk?.ball || "05"} size={30} />
          </ImageField>
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
        <SubmitButton
          onSubmit={() => {}}
          ball="02"
          name="Edit"
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
          "w-100 duration-0 flex flex-col items-center gap-y-0! noSelect pb-3",
          "h-[500px]"
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
    <div className="flex-row gap-x-3 flex w-full items-center justify-between">
      {children}
    </div>
  );
};

const FormLabel = ({ lblfor, header }: { lblfor: string; header: string }) => {
  return (
    <Label className="" htmlFor={lblfor}>
      <h3 className="text-md font-bold text-[10pt] tracking-wider my-1 ">
        {header}
      </h3>
    </Label>
  );
};

const ImageField = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-6 flex justify-center relative  h-full "
    >
      <div className=" absolute -left-5 top-0 z-10">{children}</div>
      <div className="mt-1 border-0 border-gray-700 overflow-hidden w-50 h-50 rounded-full bg-gray-300">
        <PlaceholderPk text={"Add a pokemon"} loading={true} />
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
        className="ml-1 text-center flex flex-col items-center text-[15pt]! Text-primary! font-semibold!"
      >
        <h1>Edit Pokemon</h1>
      </motion.div>
    </>
  );
};
