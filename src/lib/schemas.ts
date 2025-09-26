import { z } from "zod";
import { elmOptions, genOptions, balloptions } from "./data";
import { Element } from "./types";

//==================================================== Pk Schemas

const ElementSchema = z.enum(elmOptions);
const GenSchema = z.enum(genOptions);
const BallSchema = z.enum(balloptions);

export const AddPkFormSchema = z.object({
  Name: z
    .string()
    .min(1, { message: "required" })
    .max(20, { message: "Max 20" }),

  Xp: z
    .number("must be a number")
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
  // Sprite: z.url("Invalid URL"),
  Sprite: z.string().min(1, { message: "Sprite URL required" }),
  Trainer: z.string().min(1, { message: "Trainer ID required" }),
});

export const EditPkFormSchema = AddPkFormSchema.extend({
  Id: z.string().min(1, { message: "ID required" }),
});

export type AddPkFormValues = z.infer<typeof AddPkFormSchema>;
export type EditPkFormValues = z.infer<typeof EditPkFormSchema>;

// =================================================================== User Schemas

export const UserFormSchemaFull = z
  .object({
    id: z.string().uuid(),
    email: z
      .string()
      .min(5, { message: "Email is too short" })
      .max(30, { message: "Email is too long" }),
    name: z
      .string()
      .min(2, { message: "Name is too short" })
      .max(30, { message: "Name is too long" }),
    password: z
      .string()
      .min(3, { message: "Password is too short" })
      .max(15, { message: "Password is too long" }),
    repeatPassword: z.string(),
    avatar: z
      .number()
      .min(0, { message: "Avatar index too low" })
      .max(9, { message: "Avatar index too high" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords must match",
  });

export const UserFormSchema = UserFormSchemaFull.transform(
  ({ repeatPassword, ...rest }) => rest
);

export type UserFormInput = z.infer<typeof UserFormSchemaFull>;
export type UserFormData = z.infer<typeof UserFormSchema>;

export const SignInFormSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email is too short" })
    .max(30, { message: "Email is too long" }),
  password: z
    .string()
    .min(3, { message: "Password is too short" })
    .max(15, { message: "Password is too long" }),
});

export type SignInFormData = z.infer<typeof SignInFormSchema>;

// =================================================================== Settings Schemas
