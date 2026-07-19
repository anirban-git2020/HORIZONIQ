import type { DigestItem } from "@/lib/digest/compose";

/**
 * Weekly digest email — bulletproof HTML (tables, inline styles, no external
 * CSS, no JS, no SVG). Light theme for deliverability + universal rendering.
 * The momentum "bar" is a nested div, which Gmail/Outlook/Apple Mail all honour;
 * the richer PNG sparkline lands in D2b-2.
 */

const C = {
  page: "#f5f6f8",
  card: "#ffffff",
  ink: "#1a1c1f",
  muted: "#6b7078",
  hair: "#e6e8eb",
  accent: "#185fa5",
  accentBg: "#e6f1fb",
  rising: "#1a7f4b",
  falling: "#b26a00",
  track: "#eceef1",
};

export type DigestEmail = { subject: string; html: string; text: string };

type RenderOptions = {
  firstName: string | null;
  items: DigestItem[];
  steadyCount: number;
  dashboardUrl: string;
  unsubscribeUrl: string;
  issueDate: Date;
  issueNumber?: number;
};

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

function toneFor(bucket: DigestItem["bucket"]): string {
  return bucket === "rising" ? C.rising : bucket === "falling" ? C.falling : C.accent;
}

function valueLabel(item: DigestItem): string {
  if (item.bucket === "new") return "New";
  return item.delta > 0 ? `+${item.delta}` : `${item.delta}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderDigestEmail(opts: RenderOptions): DigestEmail {
  const { items, steadyCount, dashboardUrl, unsubscribeUrl, issueDate } = opts;
  const count = items.length;
  const subject = `HorizonIQ Weekly Digest — ${count} ${count === 1 ? "field" : "fields"} moved`;

  const maxAbs = Math.max(1, ...items.map((i) => Math.abs(i.delta)));
  const hi = opts.firstName ? `Hi ${esc(opts.firstName)},` : "Hi,";

  const rows = items
    .map((item) => {
      const tone = toneFor(item.bucket);
      const barPx = Math.max(10, Math.round((Math.abs(item.delta) / maxAbs) * 180));
      const badge =
        item.bucket === "new"
          ? `<span style="font-size:11px;font-weight:500;color:${C.accent};background:${C.accentBg};padding:1px 7px;border-radius:6px;margin-left:6px;">New</span>`
          : "";
      return `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid ${C.hair};">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:top;">
              <div style="font-size:15px;font-weight:500;color:${C.ink};">${esc(item.title)}${badge}</div>
              <div style="font-size:13px;line-height:1.55;color:${C.muted};margin-top:3px;">${esc(item.line)}</div>
              <div style="margin-top:8px;background:${C.track};border-radius:4px;height:6px;width:180px;">
                <div style="background:${tone};height:6px;border-radius:4px;width:${barPx}px;"></div>
              </div>
            </td>
            <td style="vertical-align:top;text-align:right;white-space:nowrap;font-size:15px;font-weight:500;color:${tone};padding-left:14px;">${valueLabel(item)}</td>
          </tr></table>
        </td>
      </tr>`;
    })
    .join("");

  const steadyLine =
    steadyCount > 0
      ? `<p style="font-size:13px;color:${C.muted};margin:14px 0 0;">${steadyCount} other ${steadyCount === 1 ? "field" : "fields"} held steady.</p>`
      : "";

  const html = `<!-- HorizonIQ Weekly Digest -->
<div style="background:${C.page};padding:24px 12px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" align="center" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:${C.card};border:1px solid ${C.hair};border-radius:10px;">
    <tr><td style="padding:16px 24px;border-bottom:2px solid ${C.accent};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-size:17px;font-weight:500;color:${C.ink};">HorizonIQ <span style="color:${C.muted};font-weight:400;">Weekly Digest</span></td>
        <td style="text-align:right;font-size:12px;color:${C.muted};">${opts.issueNumber ? `Issue ${opts.issueNumber}<br>` : ""}${fmtDate(issueDate)}</td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:22px 24px 20px;">
      <p style="font-size:14px;color:${C.ink};margin:0 0 4px;">${hi}</p>
      <p style="font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${C.accent};margin:12px 0 0;">Since your last digest</p>
      <p style="font-size:20px;color:${C.ink};margin:6px 0 0;">${count} of your ${count === 1 ? "fields" : "fields"} moved this week</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:1px solid ${C.hair};">
        ${rows}
      </table>
      ${steadyLine}
      <div style="margin-top:22px;">
        <a href="${dashboardUrl}" style="display:inline-block;background:${C.accent};color:#ffffff;text-decoration:none;font-size:14px;font-weight:500;padding:11px 20px;border-radius:8px;">Read the full brief</a>
      </div>
    </td></tr>
  </table>
  <table role="presentation" align="center" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
    <tr><td style="text-align:center;padding:16px 12px 4px;font-size:12px;line-height:1.7;color:${C.muted};">
      You're receiving this because you turned on the weekly digest.<br>
      <a href="${unsubscribeUrl}" style="color:${C.muted};">Unsubscribe</a>
    </td></tr>
  </table>
</div>`;

  const text = [
    `HorizonIQ Weekly Digest — ${fmtDate(issueDate)}`,
    "",
    `${hi}`,
    `${count} of your fields moved since your last digest:`,
    "",
    ...items.map((i) => `- ${i.title} (${valueLabel(i)}): ${i.line}`),
    steadyCount > 0 ? `\n${steadyCount} other fields held steady.` : "",
    "",
    `Read the full brief: ${dashboardUrl}`,
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  return { subject, html, text };
}
