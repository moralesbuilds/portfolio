"use server";

import z from "zod";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createLead, createRateLimitStore, getDb } from "@moralesbuilds/contents-db";
import { ContactMeActionState, contactMeSchema } from "../schemas";
import { renderContactNotificationEmail } from "../emails/contact_notification_email";
import { hasTooManyLinks } from "../utils/spam";
import { isRateLimited } from "@/lib/rate_limit";
import { sha256Hex } from "@/lib/crypto";
import { verifyTurnstile } from "@/lib/turnstile";

async function extractIpAddress(): Promise<string> {
  const headerList = await headers();
  const cfConnectingIp = headerList.get("cf-connecting-ip");
  const forwardedFor = headerList.get("x-forwarded-for");  
  if (cfConnectingIp) {
    return cfConnectingIp;
  } else if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "127.0.0.1";
}

const clockSkewToleranceMS = 5000; 

export async function contactMeAction(_prev: ContactMeActionState, formData: FormData): Promise<ContactMeActionState> {
  // Honeypot trap verification
  const website = formData.get("website");
  if (website !== null && website !== "") {
    return { success: true };
  }

  // Timetrap verification
  const { env } = await getCloudflareContext({ async: true });
  const minFormFillMS = Number(env.MIN_FORM_FILL_MS);
  const loadedAt = Number(formData.get("t"));
  const dt = Date.now() - loadedAt;
  const isBogus = !loadedAt || Number.isNaN(loadedAt) || dt < -clockSkewToleranceMS;
  const isTooFast = dt >= 0 && dt < minFormFillMS;
  if (isBogus || isTooFast) {
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

  // IP Address & Rate limiting
  const ipAddress = await extractIpAddress();
  const db = getDb(env.CONTENTS_DB);
  const rateStore = createRateLimitStore(db);
  const key = `contact:${await sha256Hex(ipAddress + env.CONTACT_FORM_SALT)}`;

  const max = Number(env.RATE_LIMIT_MAX_ATTEMPTS);
  const windowMs = Number(env.RATE_LIMIT_WINDOW_MS);
  const limited = await isRateLimited(rateStore, key, Date.now(), { max, windowMs });
  if (limited) {
    return {
      success: false,
      error: "Too many attemps. Please try again in a few minutes"
    };
  }

  // Turnstile verification
  const turnstileToken = String(formData.get("turnstileToken") ?? "");
  const isHuman = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, ipAddress);
  if (!isHuman) {
    return {
      success: false,
      error: "We couldn't verify you're human. Please try again."
    };
  }

  // The main operations: Save to database and send notification email
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
