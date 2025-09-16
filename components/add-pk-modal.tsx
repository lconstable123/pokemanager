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
import { cn, RomanToInt } from "@/lib/utils";
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
export function AddPkModal({ mode }: { mode?: "add" | "edit" }) {
  const Pokedex = require("pokeapi-js-wrapper");
  const P = new Pokedex.Pokedex();
  const { trainer } = useTrainerContext();
  const { AddPkModalopen, setAddPkModalOpen } = usePokeAppContext();
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
  // const [generations, setGenerations] = useState<string[]>([]);

  const [tempSelectedPK, setTempSelectedPK] = useState<string | null>(null);
  const {
    setPkDropdownEntries,
    PkDropdownEntries,
    setGenerationFilter,
    setTypeFilter,
    generationFilter,
    typeFilter,
  } = usePokeAppContext();
  //   const fetchPkByName = async (name: string) => {
  //     // toast.success("Fetching " + name + " from PokeAPI");

  //     P.getPokemonByName(name).then(function (response) {
  //       toast.success(response.name);
  //       console.log(response);
  //     });
  //   };

  //   const fetchPkByGeneration = async (generations: number[]) => {
  //     // toast.success("Fetching " + generation + " from PokeAPI");
  // const interval = {
  //     offset: 1,
  //     limit: 4,
  //   };
  //     P.getGeneration(1, interval).then(function (response) {
  //       toast.success(response.name);
  //       console.log(response);
  //     });
  //   };

  const fetchAllPK = async (page: number, limit: number) => {
    const interval = {
      offset: (page - 1) * limit,
      limit: limit,
    };
    P.getPokemonsList(interval).then(function (response) {
      toast.success("Fetched all pokemon");
      const pokeList = response.results.map((pk: any) => pk.name);
      setPkDropdownEntries(pokeList);
      console.log(pokeList);
    });
  };
  // useEffect(() => {
  //   // fetchPkByName("eevee");
  //   toast.success("changing generation filter");
  //   fetchPkByGeneration(gensAsNumber);
  //   // toast.success("Fetching Eevee from PokeAPI");
  // }, [generations]);

  // useEffect(() => {
  //   // fetchPkByName("eevee");
  //   toast.success("changing types filter");
  //   // fetchPkByGeneration(gensAsNumber);
  //   // toast.success("Fetching Eevee from PokeAPI");
  // }, [elements]);

  useEffect(() => {
    // fetchPkByName("eevee");
    fetchAllPK(1, 7);
    toast.success("changing types filter");
    // fetchPkByGeneration(gensAsNumber);
    // toast.success("Fetching Eevee from PokeAPI");
  }, []);

  return (
    <DialogWindowStyle
      mode={mode}
      AddPkModalopen={AddPkModalopen}
      setAddPkModalOpen={setAddPkModalOpen}
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
                  <FormLabel lblfor="gen" header="Gen" />

                  <MultiSelectFilterDropdown
                    options={[...genOptions]}
                    type="gen"
                    width="full"
                    cap={0}
                    selected={generationFilter}
                    onSelect={setGenerationFilter}
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
          <div className={`${!isSearchOpen ? "pt-5" : "pt-0"} w-full relative`}>
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

          <ImageField image={tempSelectedPK}>
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
    <div className="flex-row gap-x-3 flex w-full items-center justify-between">
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
}: {
  children: React.ReactNode;
  image?: string | null;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mt-6 flex justify-center relative  h-full "
    >
      <div className="absolute -left-5 top-0 z-10">{children}</div>
      <div className="relative mt-1 border-0 border-gray-700 overflow-hidden w-50 h-50 rounded-full bg-gray-300">
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
        className="flex flex-col items-center text-[15pt]! Text-primary! font-semibold!"
      >
        <h1>{mode === "edit" ? "Edit Pokemon" : "Add Pokemon"}</h1>
      </motion.div>
    </>
  );
};
