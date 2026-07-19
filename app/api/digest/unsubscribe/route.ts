import {
  getSupabaseAdmin,
  isFeedbackBackendConfigured,
} from "@/lib/feedback/supabase-server";

export const runtime = "nodejs";

/**
 * One-click unsubscribe from the weekly digest. No login required — the link
 * carries an opaque per-user token. Flips digest_opt_in to false for whoever
 * owns that token, then shows a plain confirmation. Uses the service-role client
 * (RLS-bypassing) because the recipient has no session in their email client.
 */
function page(message: string): Response {
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HorizonIQ digest</title></head>
<body style="margin:0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f5f6f8;color:#1a1c1f;">
<div style="max-width:460px;margin:12vh auto;background:#fff;border:1px solid #e6e8eb;border-radius:12px;padding:32px;text-align:center;">
<div style="font-size:17px;font-weight:500;">HorizonIQ <span style="color:#6b7078;font-weight:400;">Weekly Digest</span></div>
<p style="font-size:15px;line-height:1.6;color:#3a3d42;margin:18px 0 0;">${message}</p>
<a href="https://horizoniq-beta.vercel.app/account" style="display:inline-block;margin-top:20px;font-size:14px;color:#185fa5;text-decoration:none;">Manage in your account</a>
</div></body></html>`;
  return new Response(html, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token || !isFeedbackBackendConfigured()) {
    return page("This unsubscribe link is invalid or has expired.");
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("profiles")
      .update({ digest_opt_in: false })
      .eq("unsubscribe_token", token);

    if (error) {
      return page("Something went wrong. Please manage the digest from your account.");
    }
    return page("You've been unsubscribed from the weekly digest. You can re-enable it anytime.");
  } catch {
    return page("Something went wrong. Please manage the digest from your account.");
  }
}
