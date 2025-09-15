import { AddPkFormSchema } from "./schemas";

const result = AddPkFormSchema.safeParse({
  Name: "Test",
  Xp: 20,
  Gen: ["I"],
  Type: ["WrongType"], // <-- should fail
  Pokemon: "Pikachu",
  Ball: "04",
});
console.log("Validation result:");
console.log(result);
