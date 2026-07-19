import type { DigestItem } from "@/lib/digest/compose";

/**
 * Weekly digest email — premium DARK, on-brand with the HorizonIQ product.
 *
 * Deliberately dark (not light) so Outlook/Apple "dark mode" can't invert a
 * light layout into muddy gray — the `color-scheme: dark` hints tell clients the
 * palette is intentional and to leave it alone. Bulletproof throughout: a full
 * document, table layout, inline styles, no external CSS/JS/SVG/images. The
 * per-field momentum chart is a table of vertical bars, which renders in every
 * major client with no hosting or domain required.
 */

const C = {
  page: "#070b16",
  card: "#0e1424",
  cardTop: "#0b1120",
  hair: "#1e2740",
  hairSoft: "#161d30",
  ink: "#eef1f7",
  sub: "#aab2c2",
  muted: "#6b7488",
  accent: "#4da3ff",
  track: "#1a2136",
  rising: "#34d399",
  falling: "#f5b544",
  neu: "#7aa2ff",
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
  return bucket === "rising" ? C.rising : bucket === "falling" ? C.falling : C.neu;
}

function valueLabel(item: DigestItem): string {
  if (item.bucket === "new") return "New";
  return item.delta > 0 ? `+${item.delta}` : `${item.delta}`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Bulletproof vertical bar-chart of a field's recent momentum. */
function sparkline(history: number[], color: string): string {
  const pts = history.slice(-8);
  if (pts.length < 2) return "";
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const range = max - min || 1;
  const H = 30;
  const bars = pts
    .map((v, i) => {
      const h = Math.max(3, Math.round(((v - min) / range) * (H - 4)) + 4);
      const op = (0.4 + 0.6 * (i / (pts.length - 1))).toFixed(2);
      return `<td valign="bottom" style="padding:0 1px;"><div style="width:4px;height:${h}px;background:${color};opacity:${op};border-radius:1px;line-height:${h}px;font-size:1px;">&nbsp;</div></td>`;
    })
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="height:${H}px;border-collapse:collapse;"><tr>${bars}</tr></table>`;
}

export function renderDigestEmail(opts: RenderOptions): DigestEmail {
  const { items, steadyCount, dashboardUrl, unsubscribeUrl, issueDate } = opts;
  const count = items.length;
  const subject = `HorizonIQ Weekly Digest — ${count} ${count === 1 ? "field" : "fields"} moved`;
  const hi = opts.firstName ? `Hi ${esc(opts.firstName)},` : "Hi,";

  const rows = items
    .map((item, idx) => {
      const tone = toneFor(item.bucket);
      const badge =
        item.bucket === "new"
          ? `<span style="font-size:10px;font-weight:600;letter-spacing:0.04em;color:${C.neu};border:1px solid ${C.neu}55;padding:1px 6px;border-radius:20px;margin-left:8px;">NEW</span>`
          : "";
      const chart = sparkline(item.history, tone);
      return `
      <tr><td style="padding:${idx === 0 ? "4" : "18"}px 0 18px;border-bottom:1px solid ${C.hairSoft};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;">
            <div style="font-size:16px;font-weight:600;color:${C.ink};">${esc(item.title)}${badge}</div>
            <div style="font-size:13px;line-height:1.55;color:${C.sub};margin-top:4px;max-width:340px;">${esc(item.line)}</div>
          </td>
          <td style="vertical-align:middle;text-align:right;white-space:nowrap;padding-left:16px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="display:inline-table;"><tr>
              <td style="vertical-align:middle;padding-right:12px;">${chart}</td>
              <td style="vertical-align:middle;font-size:19px;font-weight:700;color:${tone};">${valueLabel(item)}</td>
            </tr></table>
          </td>
        </tr></table>
      </td></tr>`;
    })
    .join("");

  const steadyLine =
    steadyCount > 0
      ? `<p style="font-size:13px;color:${C.muted};margin:16px 0 0;">${steadyCount} other ${steadyCount === 1 ? "field" : "fields"} held steady this week.</p>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>HorizonIQ Weekly Digest</title>
<style>:root{color-scheme:dark;supported-color-schemes:dark;}</style>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${count} ${count === 1 ? "field" : "fields"} moved in your focus this week.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};padding:28px 12px;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${C.card};border:1px solid ${C.hair};border-radius:14px;overflow:hidden;">

      <tr><td style="padding:20px 28px;background:${C.cardTop};border-bottom:1px solid ${C.hair};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;">
            <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${C.accent};margin-right:9px;"></span>
            <span style="font-size:17px;font-weight:700;color:${C.ink};letter-spacing:-0.01em;">HorizonIQ</span>
            <span style="font-size:17px;font-weight:400;color:${C.sub};"> Weekly Digest</span>
          </td>
          <td style="vertical-align:middle;text-align:right;font-size:12px;color:${C.muted};">${fmtDate(issueDate)}</td>
        </tr></table>
      </td></tr>

      <tr><td style="padding:28px 28px 24px;">
        <p style="font-size:14px;color:${C.sub};margin:0 0 18px;">${hi}</p>
        <p style="font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${C.accent};margin:0;">Since your last digest</p>
        <p style="font-size:24px;line-height:1.25;font-weight:700;color:${C.ink};margin:8px 0 0;letter-spacing:-0.02em;">${count} of your ${count === 1 ? "fields" : "fields"} moved this week</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-top:1px solid ${C.hair};">
          ${rows}
        </table>
        ${steadyLine}

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:26px;"><tr>
          <td style="border-radius:9px;background:${C.accent};">
            <a href="${dashboardUrl}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#04122b;text-decoration:none;">Read the full brief &rarr;</a>
          </td>
        </tr></table>
      </td></tr>

    </table>

    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="text-align:center;padding:18px 12px 4px;font-size:12px;line-height:1.7;color:${C.muted};font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        You're receiving this because you turned on the HorizonIQ weekly digest.<br>
        <a href="${unsubscribeUrl}" style="color:${C.sub};text-decoration:underline;">Unsubscribe</a>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  const text = [
    `HorizonIQ Weekly Digest — ${fmtDate(issueDate)}`,
    "",
    hi,
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
