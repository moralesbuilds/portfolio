import { z } from "zod";

export const contactMeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(100)
    .pipe(z.email()),
  message: z.string().trim().min(1).max(2000),
});

export type ContactMeActionState = {
  success: boolean;
  form?: Partial<z.infer<typeof contactMeSchema>>;
  error?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};
