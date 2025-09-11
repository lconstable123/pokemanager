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

// import { Popover } from "@radix-ui/react-popover";
export function AddPkModal() {
  const { trainer } = useTrainerContext();
  // const trainerSprite = getTrainerSprite(trainer.avatar);
  const { AddPkModalopen, setAddPkModalOpen } = usePokeAppContext();
  // const handleOpen = () => {
  //   toast.success("Profile modal opened");
  //   setAddPkModalOpen(true);
  // };
  // const handleClose = () => {
  //   toast.success("Profile modal closed");
  //   setAddPkModalOpen(false);
  // };
  return (
    <Dialog open={AddPkModalopen} onOpenChange={setAddPkModalOpen}>
      <DialogTrigger asChild>
        {/* <ProfileButton handleClick={handleOpen} sprite={trainerSprite} /> */}
      </DialogTrigger>
      <DialogContent tabIndex={-1} className="gap-y-2! noSelect pb-9">
        <DialogHeader></DialogHeader>

        <DialogTitle className="hidden">Trainer Info</DialogTitle>

        <div className=" flex flex-col items-center gap-3 text-[15pt]! Text-primary! font-semibold!">
          <h1>Add Pokemon</h1>
        </div>
        <div className=" pt-5 pb-2 items-center flex flex-col gap-3 justify-center">
          <div className=" items-center w-80 flex flex-col  flex-grow">
            <hr className="border-1 w-full" />
            <h3>Search Filter</h3>
            <div className="flex-row gap-x-3 flex w-full justify-center">
              <div className="w-full  ">
                <Label className="" htmlFor="type">
                  <h3 className="text-md font-bold">Gen</h3>
                </Label>
                <MultiSelectDropdown
                  options={genOptions}
                  width="full basis-1 flex-grow"
                />
              </div>
              <div className="w-full ">
                <Label className="" htmlFor="type">
                  <h3 className="text-md font-bold">Type</h3>
                </Label>
                <MultiSelectDropdown options={elmOptions} width="full" />
              </div>
            </div>
            <hr className="border-1 w-full" />
            <div className="w-full relative">
              <Label className="" htmlFor="type">
                <h3 className="text-md font-bold">Pokemon</h3>
              </Label>
              <MultiSelectDropdown options={elmOptions} width="full" />
              {/* <FormErrorMessage message="Type is required" /> */}
            </div>
            <div className="w-full">
              <Label className="" htmlFor="type">
                <h3 className="text-md font-bold">Name</h3>
              </Label>
              <Input placeholder="Name" />
            </div>
          </div>

          <div className=" border-0 border-gray-700 relative overflow-hidden w-50 h-50 rounded-full bg-gray-300">
            {/* <img
              src={""}
              alt="Trainer"
              className="pixelImage absolute object-cover -top-15 w-100 h-100"
            /> */}
          </div>
          <div className="relative">
            {/* <Input placeholder="type" dropdown={true} /> */}
            {/* <Dropdown extraStyling="w-60" /> */}
          </div>
          <SubmitButton onSubmit={() => {}} ball="02" name="Logout" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
