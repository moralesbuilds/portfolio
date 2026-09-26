import { z } from "zod";

export const contactMeSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.email().trim().lowercase().min(1).max(100),
  message: z.string().trim().min(1).max(2000)
});

export type ContactMeActionState = {
  success: boolean;
  form?: {
    name?: string;
    email?: string;
    message?: string;
  };
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};
