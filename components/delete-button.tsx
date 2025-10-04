"use client";
import React from "react";
import SubmitButton from "./submit-button";
import { motion } from "framer-motion";

export default function DeleteButton({
  handleDelete,
}: {
  handleDelete: () => void;
}) {
  const [deleteState, setDeleteState] = React.useState<"initial" | "confirm">(
    "initial"
  );
  const handleClick = () => {
    if (deleteState === "initial") {
      // toast.success("displaying cofnirm");
      setDeleteState("confirm");
    } else {
      // toast.success("Deleted!");
      handleDelete?.();
    }
  };

  return (
    <>
      {deleteState === "initial" ? (
        <SubmitButton
          onClick={() => {
            handleClick();
          }}
          ball="02"
          name="delete"
          ballPadding="20px"
          style="noball"
          type="button"
          colorStyle="delete"
        />
      ) : (
        <motion.div
          className=""
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <SubmitButton
            onClick={() => {
              handleClick();
            }}
            ball="02"
            name="are you sure?"
            ballPadding="20px"
            style="noball"
            type="button"
            colorStyle="urgent"
            textSize="small"
          />
        </motion.div>
      )}
    </>
  );
}
