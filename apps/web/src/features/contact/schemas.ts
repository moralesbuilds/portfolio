import { z } from "zod";

export const contactMeSchema = z.object({
  name: z
    .string({ error: "name_required" })
    .trim()
    .min(1, { error: "name_required" })
    .max(100, { error: "name_too_long" }),
  email: z
    .string({ error: "email_required" })
    .trim()
    .toLowerCase()
    .max(100, { error: "email_too_long" })
    .pipe(z.email({ error: "email_invalid" })),
  message: z
    .string({ error: "message_required" })
    .trim()
    .min(1, { error: "message_required" })
    .max(2000, { error: "message_too_long" }),
});

export type ContactMeFormData = z.infer<typeof contactMeSchema>;

export type ContactMeActionState = {
  success: boolean;
  form?: Partial<ContactMeFormData>;
  error?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};
