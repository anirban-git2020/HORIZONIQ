import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

const ROUTES = [
  "",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/changelog",
  "/roadmap",
  "/dashboard",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/dashboard" ? 0.8 : 0.6,
  }));
}
