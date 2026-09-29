"use server";

import z from "zod";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createLead, createRateLimitStore, getDb, type Locale } from "@moralesbuilds/contents-db";
import { type ContactMeActionState, type ContactMeFormData, contactMeSchema } from "../schemas";
import { renderContactNotificationEmail } from "../emails/contact_notification_email";
import { hasTooManyLinks } from "../utils/spam";
import { isRateLimited } from "@/lib/rate_limit";
import { sha256Hex } from "@/lib/crypto";
import { verifyTurnstile } from "@/lib/turnstile";
import { getLocale } from "next-intl/server";

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

async function sendEmail(env: CloudflareEnv, data: ContactMeFormData) {
  try {
    const response = await env.EMAIL.send({
      from: env.APP_EMAIL,
      to: env.CONTACT_EMAIL,
      subject: "Someone is trying to reach you!",
      html: renderContactNotificationEmail({ ...data, submittedAt: new Date().toLocaleString() })
    });
    console.log(response); // Left on purpose to monitoring the response in production
  } catch (err) {
    console.error(err);
  }
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
      error: "too_many_attempts"
    };
  }

  // Turnstile verification
  const turnstileToken = String(formData.get("turnstileToken") ?? "");
  const isHuman = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET, ipAddress);
  if (!isHuman) {
    return {
      success: false,
      error: "turnstile_verify_failed"
    };
  }

  // The main operations: Save to database and send notification email
  try {
    const locale = await getLocale() as Locale;
    await createLead(db, {
      ...validationResult.data,
      leadSource: "website",
      ipAddress,
      locale,
    });
    await sendEmail(env, validationResult.data);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "unexpected_error" };
  }
}
