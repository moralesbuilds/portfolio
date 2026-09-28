// Based on https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

type TurnstileResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstile(token: string, secret: string, remoteip: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          secret,
          response: token,
          remoteip,
        }),
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!response.ok) {
      return false;
    }

    const result = await response.json() as TurnstileResponse;
    return result.success === true;
  } catch {
    return false;
  }
}
