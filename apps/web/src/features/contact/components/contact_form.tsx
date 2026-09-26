"use client";

import { useTranslations } from "next-intl";
import React, { useActionState, useState } from "react";
import { contactMeAction } from "../actions/contact_me";
import { FieldErrors, SubmitButton } from "@/components";

export function ContactForm() {
  const t = useTranslations("contact");
  const [loadedAt] = useState(() => Date.now());
  const [state, action, isPending] = useActionState(contactMeAction, { success: false });
  
  const hasNameError = (state.errors?.name?.length ?? 0) > 0;
  const hasEmailError = (state.errors?.email?.length ?? 0) > 0;
  const hasMessageError = (state.errors?.message?.length ?? 0) > 0;

  return (
    <div className="w-full max-w-4xl md:p-8">
      <form action={action} className="space-y-6" noValidate>
        {/* Success banner */}
        {state.success && <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-md bg-green-50" role="alert">
          <span className="font-medium">{t("success")}</span> {t("success_message")}
        </div>}

        {/* Name Field */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-semibold text-slate-900 md-2">
            {t("fields.name.label")}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isPending}
            defaultValue={state.form?.name}
            placeholder={t("fields.name.placeholder")}
            aria-invalid={hasNameError}
            aria-describedby={hasNameError ? "name-errors" : undefined}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors"
          />
          <FieldErrors id="name-errors" errors={state.errors?.name} />
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-900 md-2">
            {t("fields.email.label")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled={isPending}
            defaultValue={state.form?.email}
            placeholder={t("fields.email.placeholder")}
            aria-invalid={hasEmailError}
            aria-describedby={hasEmailError ? "email-errors" : undefined}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors"
          />
          <FieldErrors id="email-errors" errors={state.errors?.email} />
        </div>

        {/* Message Field */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="block text-sm font-semibold text-slate-900 md-2">
            {t("fields.message.label")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            disabled={isPending}
            defaultValue={state.form?.message}
            placeholder={t("fields.message.placeholder")}
            aria-invalid={hasMessageError}
            aria-describedby={hasMessageError ? "message-errors" : undefined}
            className="w-full rounded-xl border border-slate-300 mb-0 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors"
          />
          <FieldErrors id="message-errors" errors={state.errors?.message} />
        </div>

        {/* Honeypot: Website Field */}
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px" }}
          data-testid="field-website"
        />

        {/* Time trap */}
        <input type="hidden" name="t" value={loadedAt} data-testid="field-loadedat" />

        <SubmitButton label={t("submit")} isSubmitting={isPending} />
      </form>
    </div>
  );
}
