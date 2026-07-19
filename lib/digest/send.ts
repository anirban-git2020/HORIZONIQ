/**
 * Resend email send via REST — no SDK dependency. Server/CI only (needs the
 * secret RESEND_API_KEY). Returns a result rather than throwing so the sender
 * can continue to the next user on a single failure.
 */

export type SendResult = { ok: true } | { ok: false; error: string };

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** One-click unsubscribe target — becomes a List-Unsubscribe header. */
  unsubscribeUrl?: string;
};

export async function sendEmail(input: SendEmailInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not set" };

  // `||` (not `??`) so an unset secret — which arrives as "" from GitHub
  // Actions, not undefined — still falls back to Resend's test sender.
  const from = process.env.DIGEST_FROM || "HorizonIQ <onboarding@resend.dev>";

  // List-Unsubscribe (+ One-Click) is a strong deliverability signal and gives
  // Gmail/Outlook a native unsubscribe control.
  const headers: Record<string, string> = input.unsubscribeUrl
    ? {
        "List-Unsubscribe": `<${input.unsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      }
    : {};

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        headers,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `${res.status} ${body}`.trim() };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "network error" };
  }
}
