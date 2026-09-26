import { escapeHtml } from "@/utils/html";

type ContactNotificationEmailInput = {
  name: string;
  email: string;
  message: string;
  submittedAt: string;
};

export function renderContactNotificationEmail({ name, email, message, submittedAt }: ContactNotificationEmailInput): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New contact form submission</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px; background-color:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:24px;">
          <tr><td style="font-size:16px; font-weight:bold; color:#0f172a; padding-bottom:16px;">New contact form submission</td></tr>
          <tr><td style="font-size:14px; color:#0f172a; padding-bottom:6px;"><strong>Name:</strong> ${escapeHtml(name)}</td></tr>
          <tr><td style="font-size:14px; color:#0f172a; padding-bottom:6px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}" style="color:#0891b2;">${escapeHtml(email)}</a></td></tr>
          <tr><td style="font-size:14px; color:#0f172a; padding-bottom:16px;"><strong>Date:</strong> ${escapeHtml(submittedAt)}</td></tr>
          <tr><td style="font-size:14px; color:#0f172a; padding:12px; background-color:#f1f5f9; border-radius:4px; white-space:pre-wrap;">${escapeHtml(message)}</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
