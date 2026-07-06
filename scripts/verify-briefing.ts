import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

async function main(): Promise<void> {
  const metaPath = path.join(process.cwd(), "data", "meta.json");
  const raw = await readFile(metaPath, "utf8");
  const meta = JSON.parse(raw) as {
    briefingPeriod: string;
    briefingLabel: string;
    activeBriefingFile: string;
  };

  const briefingPath = path.join(
    process.cwd(),
    "data",
    "briefings",
    meta.activeBriefingFile
  );

  if (!existsSync(briefingPath)) {
    console.error(
      `Missing briefing file for active period ${meta.briefingPeriod}: ${briefingPath}`
    );
    process.exit(1);
  }

  const briefingRaw = await readFile(briefingPath, "utf8");
  const briefing = JSON.parse(briefingRaw) as { briefingPeriod?: string };

  if (briefing.briefingPeriod !== meta.briefingPeriod) {
    console.error(
      `Briefing period mismatch: meta=${meta.briefingPeriod}, file=${briefing.briefingPeriod}`
    );
    process.exit(1);
  }

  const registryPath = path.join(
    process.cwd(),
    "lib",
    "data",
    "briefings-registry.ts"
  );
  const registryRaw = await readFile(registryPath, "utf8");
  if (!registryRaw.includes(`"${meta.briefingPeriod}"`)) {
    console.error(
      `briefings-registry.ts missing active period ${meta.briefingPeriod}. Run npm run pipeline:sync-registry.`
    );
    process.exit(1);
  }

  console.log(
    `Briefing OK: ${meta.briefingPeriod} (${meta.briefingLabel})`
  );
}

main().catch((error) => {
  console.error("Briefing verification failed:", error);
  process.exit(1);
});
