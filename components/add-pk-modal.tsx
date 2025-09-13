import { usePokeAppContext } from "@/lib/contexts/PokeAppContext";
import { useTrainerContext } from "@/lib/contexts/TrainerContext";
import React, { useState } from "react";
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
import Dropdown, { MultiSelectDropdown } from "@/components/ui/dropdown";
import { Import } from "lucide-react";
import ImportRadioDropdown from "@/components/dropdown2";
import { cn } from "@/lib/utils";
import { elmOptions, genOptions } from "@/lib/data";
import { MultiSelectBallDropdown } from "@/components/ui/dropdown-ball";
import { MultiSelectElmDropdown } from "@/components/ui/dropdown-elements";
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
export function AddPkModal() {
  const { trainer } = useTrainerContext();
  const { AddPkModalopen, setAddPkModalOpen } = usePokeAppContext();

  return (
    <Dialog open={AddPkModalopen} onOpenChange={setAddPkModalOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent tabIndex={-1} className="gap-y-1! noSelect pb-3">
        <DialogHeader></DialogHeader>
        <DialogTitle className="hidden">Trainer Info</DialogTitle>

        <div className=" flex flex-col items-center  text-[15pt]! Text-primary! font-semibold!">
          <h1>Add Pokemon</h1>
        </div>
        <FormStyle>
          <Border />
          <div className="w-full">
            <h3 className="text-[9pt] text-left ">Search Filter</h3>
          </div>
          <VertFields>
            <div className="w-full  ">
              <Label className="" htmlFor="type">
                <h3 className="text-md font-bold">Gen</h3>
              </Label>
              <MultiSelectDropdown
                options={[...genOptions]}
                width="full basis-1 flex-grow"
              />
            </div>
            <div className="w-full ">
              <Label className="" htmlFor="type">
                <h3 className="text-md font-bold">Type</h3>
              </Label>
              <MultiSelectElmDropdown
                options={[...elmOptions]}
                type="icon"
                width="full"
              />
            </div>
          </VertFields>
          <Border />
          <div className="w-full relative">
            <Label className="" htmlFor="type">
              <h3 className="text-md font-bold ">Pokemon</h3>
            </Label>
            <MultiSelectDropdown options={[...elmOptions]} width="full " />
            {/* <FormErrorMessage message="Type is required" /> */}
          </div>

          <div className="mt-4 flex justify-center relative  h-full ">
            <div className=" absolute -left-5 top-0 z-10">
              <MultiSelectBallDropdown
                options={[...elmOptions]}
                width="full absolute left-0 top-0 "
              />
            </div>

            <div className="mt-1 border-0 border-gray-700 overflow-hidden w-50 h-50 rounded-full bg-gray-300">
              {/* <img
              src={""}
              alt="Trainer"
              className="pixelImage absolute object-cover -top-15 w-100 h-100"
              /> */}
            </div>
          </div>
          <VertFields>
            <div className="w-200">
              <Label className="" htmlFor="type">
                <h3 className="text-md font-bold">Name</h3>
              </Label>
              <Input placeholder="Name" />
            </div>
            <div className="w-full">
              <Label className="" htmlFor="type">
                <h3 className="text-md font-bold">Xp</h3>
              </Label>
              <Input placeholder="Xp" />
            </div>
          </VertFields>
        </FormStyle>
      </DialogContent>
    </Dialog>
  );
}

const Border = () => {
  return <hr className="border-1 w-full mt-2" />;
};

const FormStyle = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="items-center flex flex-col    justify-center">
      <div className="gap-y-1 items-center w-80 mb-5 flex flex-col flex-grow">
        {children}
      </div>
      <SubmitButton onSubmit={() => {}} ball="02" name="Add" />
    </div>
  );
};

const VertFields = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-row gap-x-5 flex w-full items-center justify-center">
      {children}
    </div>
  );
};
