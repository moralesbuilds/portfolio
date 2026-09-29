type EmailInput = {
  from: string;
  to: string;
  subject: string;
  html: string;
};

type OkEmailResponse = {
  id: string;
};

export async function sendEmail(apiKey: string, input: EmailInput): Promise<boolean> {
  if (!apiKey) {
    return false;
  }

  try {
    const response = await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input),
        signal: AbortSignal.timeout(5000)
      }
    );
    const body = await response.json() as OkEmailResponse;
    if (!response.ok) {
      console.error(body);
      return false;
    }
    console.log(body);
    return !!body.id;
  } catch {
    return false;
  }
}
