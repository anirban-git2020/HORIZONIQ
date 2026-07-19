import "dotenv/config";

import { composeDigest, type DigestSnapshot } from "@/lib/digest/compose";
import { renderDigestEmail } from "@/lib/digest/email-template";
import { sendEmail } from "@/lib/digest/send";
import { getSupabaseAdmin } from "@/lib/feedback/supabase-server";
import { readLatestNarratives } from "@/lib/pipeline/store/narratives";
import { readLatestScores, readScoreHistory } from "@/lib/pipeline/store/observations";

/**
 * Weekly digest sender (CI / manual). For each opted-in user it diffs their
 * tracked interests against the momentum they last saw, and emails the movers.
 *
 * Baseline discipline: the FIRST run for a user only records a baseline (no
 * email). Afterwards the baseline advances ONLY when an email is actually sent,
 * so slow week-over-week drift accumulates until it crosses the threshold and is
 * never silently swallowed on a quiet week.
 */

type ProfileRow = {
  id: string;
  email: string | null;
  display_name: string | null;
  interests: unknown;
  digest_snapshot: DigestSnapshot | null;
  unsubscribe_token: string;
};

// `||` so an unset GitHub secret ("") falls back rather than passing empty.
const SITE_URL =
  process.env.DIGEST_SITE_URL || "https://horizoniq-beta.vercel.app";

async function main() {
  const supabase = getSupabaseAdmin();
  const [scores, narratives, history] = await Promise.all([
    readLatestScores(),
    readLatestNarratives(),
    readScoreHistory(),
  ]);

  if (!scores) {
    console.error("No score bundle found — aborting.");
    process.exit(1);
  }

  // Per-interest momentum series (oldest → newest) for the email sparklines.
  const historyByInterest = new Map<string, number[]>();
  for (const bundle of history) {
    for (const s of bundle.interests) {
      const series = historyByInterest.get(s.interestId) ?? [];
      series.push(Math.round(s.momentum));
      historyByInterest.set(s.interestId, series);
    }
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, display_name, interests, digest_snapshot, unsubscribe_token")
    .eq("digest_opt_in", true);

  if (error) {
    console.error("Failed to load opted-in profiles:", error.message);
    process.exit(1);
  }

  const rows = (data ?? []) as ProfileRow[];
  console.log(`Opted-in users: ${rows.length}`);

  let sent = 0;
  let baselined = 0;
  let quiet = 0;

  for (const row of rows) {
    if (!row.email) continue;
    const interests = Array.isArray(row.interests) ? (row.interests as string[]) : [];
    if (interests.length === 0) continue;

    const composed = composeDigest(
      interests,
      scores.interests,
      row.digest_snapshot,
      narratives,
      historyByInterest
    );

    // First run — record the baseline, send nothing.
    if (!row.digest_snapshot) {
      await supabase
        .from("profiles")
        .update({ digest_snapshot: composed.snapshot })
        .eq("id", row.id);
      baselined += 1;
      continue;
    }

    // Quiet week — keep the baseline so drift keeps accumulating.
    if (composed.items.length === 0) {
      quiet += 1;
      continue;
    }

    const unsubscribeUrl = `${SITE_URL}/api/digest/unsubscribe?token=${row.unsubscribe_token}`;
    const email = renderDigestEmail({
      firstName: row.display_name,
      items: composed.items,
      steadyCount: composed.steadyCount,
      dashboardUrl: `${SITE_URL}/dashboard`,
      unsubscribeUrl,
      issueDate: new Date(),
    });

    const result = await sendEmail({
      to: row.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      unsubscribeUrl,
    });

    if (!result.ok) {
      console.error(`  send failed for ${row.id}: ${result.error}`);
      continue; // keep baseline; retry next week
    }

    await supabase
      .from("profiles")
      .update({ digest_snapshot: composed.snapshot, digest_last_sent_at: new Date().toISOString() })
      .eq("id", row.id);
    sent += 1;
  }

  console.log(`Done. sent=${sent} baselined=${baselined} quiet=${quiet}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
