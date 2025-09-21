import { z } from "zod";
import { elmOptions, genOptions, balloptions } from "./data";
import { Element } from "./types";
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

  Type: z
    .array(z.string())
    .min(1, { message: "At least 1" })
    .superRefine((vals, ctx) => {
      vals.forEach((val, index) => {
        if (!elmOptions.includes(val as Element)) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid type`,
            path: [index],
          });
        }
      });
    }),
  Pokemon: z.string().min(1, { message: "Please select a Pokemon" }),

  Ball: BallSchema,
  Sprite: z.url("Invalid URL"),
  Trainer: z.string().min(1, { message: "Trainer ID required" }),
});
export const EditPkFormSchema = AddPkFormSchema.omit({
  Ball: true,
}).extend({
  id: z.string().min(1, { message: "ID required" }),
});

export type AddPkFormValues = z.infer<typeof AddPkFormSchema>;
export type EditPkFormValues = z.infer<typeof EditPkFormSchema>;
