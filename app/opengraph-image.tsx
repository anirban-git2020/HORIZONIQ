import { ImageResponse } from "next/og";

import {
  BRAND_HORIZON_COLOR,
  BRAND_IQ_COLOR,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
} from "@/lib/site";

export const alt = `HorizonIQ — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(160deg, #06080F 0%, #0B1220 55%, #0F1A2E 100%)",
          color: "#F5F6F8",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: BRAND_IQ_COLOR,
              }}
            />
          </div>
          <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>
            <span style={{ color: BRAND_HORIZON_COLOR }}>Horizon</span>
            <span style={{ color: BRAND_IQ_COLOR }}>IQ</span>
          </span>
        </div>
        <p
          style={{
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          {SITE_TAGLINE}
        </p>
        <p
          style={{
            fontSize: 26,
            lineHeight: 1.4,
            color: "rgba(245,246,248,0.72)",
            maxWidth: 800,
          }}
        >
          {SITE_DESCRIPTION}
        </p>
        <p
          style={{
            marginTop: 48,
            fontSize: 16,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(245,246,248,0.5)",
          }}
        >
          Beta Preview
        </p>
      </div>
    ),
    { ...size }
  );
}
