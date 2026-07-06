import { NextResponse } from "next/server";

import {
  FEEDBACK_MESSAGE_MAX_LENGTH,
  FEEDBACK_MESSAGE_MIN_LENGTH,
  FEEDBACK_SCREENSHOT_MAX_BYTES,
  FEEDBACK_SCREENSHOT_MIME_TYPES,
  FEEDBACK_STORAGE_BUCKET,
} from "@/lib/feedback/constants";
import {
  getSupabaseAdmin,
  isFeedbackBackendConfigured,
} from "@/lib/feedback/supabase-server";
import type { FeedbackMetadata } from "@/types/feedback";
import { FEEDBACK_TYPES } from "@/types/feedback";

export const runtime = "nodejs";

function parseMetadata(raw: string | null): FeedbackMetadata | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FeedbackMetadata;
  } catch {
    return null;
  }
}

function extensionForMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export async function POST(request: Request) {
  if (!isFeedbackBackendConfigured()) {
    return NextResponse.json(
      {
        error:
          "Feedback is temporarily unavailable. The team has not finished backend setup.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const type = String(formData.get("type") ?? "");
    const message = String(formData.get("message") ?? "").trim();
    const emailRaw = formData.get("email");
    const email =
      typeof emailRaw === "string" && emailRaw.trim() ? emailRaw.trim() : null;
    const metadata = parseMetadata(String(formData.get("metadata") ?? ""));
    const screenshot = formData.get("screenshot");

    if (!FEEDBACK_TYPES.includes(type as (typeof FEEDBACK_TYPES)[number])) {
      return NextResponse.json({ error: "Invalid feedback type." }, { status: 400 });
    }

    if (
      message.length < FEEDBACK_MESSAGE_MIN_LENGTH ||
      message.length > FEEDBACK_MESSAGE_MAX_LENGTH
    ) {
      return NextResponse.json({ error: "Invalid message length." }, { status: 400 });
    }

    if (!metadata) {
      return NextResponse.json({ error: "Invalid metadata." }, { status: 400 });
    }

    let screenshotUrl: string | null = null;
    const supabase = getSupabaseAdmin();

    if (screenshot instanceof File && screenshot.size > 0) {
      if (
        !FEEDBACK_SCREENSHOT_MIME_TYPES.includes(
          screenshot.type as (typeof FEEDBACK_SCREENSHOT_MIME_TYPES)[number]
        )
      ) {
        return NextResponse.json(
          { error: "Screenshot must be PNG, JPEG, or WEBP." },
          { status: 400 }
        );
      }

      if (screenshot.size > FEEDBACK_SCREENSHOT_MAX_BYTES) {
        return NextResponse.json(
          { error: "Screenshot must be 5 MB or smaller." },
          { status: 400 }
        );
      }

      const ext = extensionForMime(screenshot.type);
      const path = `${metadata.visitorId ?? "anonymous"}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const buffer = Buffer.from(await screenshot.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from(FEEDBACK_STORAGE_BUCKET)
        .upload(path, buffer, {
          contentType: screenshot.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("[feedback] screenshot upload failed", uploadError);
        return NextResponse.json(
          { error: "Screenshot upload failed. Try again without an image." },
          { status: 500 }
        );
      }

      const { data: publicUrl } = supabase.storage
        .from(FEEDBACK_STORAGE_BUCKET)
        .getPublicUrl(path);

      screenshotUrl = publicUrl.publicUrl;
    }

    const { data, error } = await supabase
      .from("feedback")
      .insert({
        type,
        message,
        email,
        screenshot_url: screenshotUrl,
        metadata,
        status: "NEW",
      })
      .select("id")
      .single();

    if (error) {
      console.error("[feedback] insert failed", error);
      return NextResponse.json(
        { error: "Unable to save feedback. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id as string });
  } catch (error) {
    console.error("[feedback] unexpected error", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
