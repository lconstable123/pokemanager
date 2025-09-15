import { z } from "zod";
import { elmOptions, genOptions, balloptions } from "./data";
const ElementSchema = z.enum(elmOptions);

const GenSchema = z.enum(genOptions);
const BallSchema = z.enum(balloptions);
export const AddPkFormSchema = z.object({
  Name: z
    .string()
    .min(1, { message: "required" })
    .max(20, { message: "Max 20" }),

  Xp: z
    .number()
    .min(1, { message: "At least 1" })
    .max(100, { message: "Max 100 Xp" }),

  // Gen: z
  //   .array(z.string())
  //   .min(1, { message: "required" })
  //   .superRefine((vals, ctx) => {
  //     vals.forEach((val, index) => {
  //       if (!genOptions.includes(val as Gen)) {
  //         ctx.addIssue({
  //           code: "custom",
  //           message: `Invalid generation selected: ${val}`,
  //           path: [index],
  //         });
  //       }
  //     });
  //   }),

  // Type: z
  //   .array(z.string())
  //   .min(1, { message: "At least 1" })
  //   .superRefine((vals, ctx) => {
  //     vals.forEach((val, index) => {
  //       if (!elmOptions.includes(val as Element)) {
  //         ctx.addIssue({
  //           code: "custom",
  //           message: `Invalid type`,
  //           path: [index],
  //         });
  //       }
  //     });
  //   }),

  Pokemon: z.string().min(1, { message: "Please select a Pokemon" }),

  Ball: BallSchema,
});

export type AddPkFormValues = z.infer<typeof AddPkFormSchema>;
