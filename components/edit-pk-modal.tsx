"use client";
import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import React, { use, useState } from "react";
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
  const { EditPkModalopen, setEditPkModalOpen } = usePokeAppContext();
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
    control,
    formState: { isSubmitting, errors },
  } = useForm<AddPkFormValues>({
    resolver: zodResolver(AddPkFormSchema),
    defaultValues: {
      Name: "anthony",
      Xp: 12,
      // Gen: ["I"],
      // Type: ["Fire"],
      Pokemon: "lAPRAS",
      Ball: "02",
    },
  });
  const controls = useAnimation();
  const handleAnimateOpen = () => {
    controls.start({ height: "200px", transition: { duration: 0.3 } });
  };
  const handleAnimateClose = () => {
    controls.start({ height: 0, transition: { duration: 0.3 } });
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
        <div className="gap-y-1 items-center w-60 mb-5 flex flex-col flex-grow">
          <SearchFilterButton
            handleClick={handleSearchToggle}
            isSearchOpen={isSearchOpen}
          />

          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={clsx(
                "w-full h-full p-2 transition-all duration-400 overflow-hidden"
              )}
            >
              <VertFields>
                <div className="">
                  <FormLabel lblfor="gen" header="Gen" />

                  <MultiSelectFilterDropdown
                    options={[...genOptions]}
                    type="gen"
                    width="full"
                    cap={0}
                    selected={elements}
                    onSelect={setElements}
                  />
                </div>
                <div className="relative">
                  <FormLabel lblfor="elm" header="Type" />

                  <MultiSelectFilterDropdown
                    options={[...elmOptions]}
                    type="elm"
                    width="full"
                    selected={generations}
                    onSelect={setGenerations}
                  />
                </div>
              </VertFields>
              <div className={cn("mt-5 w-full transition-all duration-400")}>
                <Border />
              </div>
            </motion.div>
          )}
          <div className={`${!isSearchOpen ? "pt-5" : "pt-0"} w-full relative`}>
            <FormLabel lblfor="pk" header="Add Pokemon" />
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
          "w-100 duration-0 flex flex-col items-center gap-y-1! noSelect pb-3",
          isSearchOpen ? "h-[650px]" : "h-[550px]"
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.1 }}
      className="mt-6 flex justify-center relative  h-full "
    >
      <div className=" absolute -left-5 top-0 z-10">{children}</div>
      <div className="mt-1 border-0 border-gray-700 overflow-hidden w-50 h-50 rounded-full bg-gray-300" />
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
