import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#06080F",
          borderRadius: 8,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
        >
          <path
            d="M3 15c3-5 6-5 9 0s6 5 9 0"
            stroke="#2DD4BF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="8" r="2" fill="#2DD4BF" />
        </svg>
        <span style={{ position: "absolute", opacity: 0 }}>{SITE_NAME}</span>
      </div>
    ),
    { ...size }
  );
}
