"use server";

import z from "zod";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createLead, getDb } from "@moralesbuilds/contents-db";
import { ContactMeActionState, contactMeSchema } from "../schemas";
import { renderContactNotificationEmail } from "../emails/contact_notification_email";
import { hasTooManyLinks } from "../utils/spam";

export async function contactMeAction(_prev: ContactMeActionState, formData: FormData): Promise<ContactMeActionState> {
  // Honeypot trap
  if (formData.get("website")) {
    return { success: true };
  }

  // Timetrap
  const { env } = await getCloudflareContext({ async: true });
  const minFormFillMS = Number(env.MIN_FORM_FILL_MS);
  const loadedAt = Number(formData.get("t"));
  if (!loadedAt || Date.now() - loadedAt < minFormFillMS) {
    return { success: true };
  }
  
  // Zod Validation
  const form = Object.fromEntries(formData);
  const validationResult = contactMeSchema.safeParse(form);
  if (!validationResult.success) {
    return {
      success: false,
      form,
      errors: z.flattenError(validationResult.error).fieldErrors
    };
  }

  // Spam Heuristics
  if (hasTooManyLinks(validationResult.data.message)) {
    return { success: true };
  }

  const db = getDb(env.CONTENTS_DB);
  const headerList = await headers();

  // IP Address
  const cfConnectingIp = headerList.get("cf-connecting-ip");
  const forwardedFor = headerList.get("x-forwarded-for");
  let ipAddress = "127.0.0.1";
  if (cfConnectingIp) {
    ipAddress = cfConnectingIp;
  } else if (forwardedFor) {
    ipAddress = forwardedFor.split(",")[0].trim();
  }

  try {
    await createLead(db, {
      ...validationResult.data,
      leadSource: "website",
      ipAddress,
    });
    const response = await env.EMAIL.send({
      from: env.APP_EMAIL,
      to: env.CONTACT_EMAIL,
      subject: "Someone is trying to reach you!",
      html: renderContactNotificationEmail({ ...validationResult.data, submittedAt: new Date().toLocaleString() })
    });
    console.log("Email response:", response);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
