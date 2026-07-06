import { syncBriefingsRegistry } from "@/lib/pipeline/store/briefing";

async function main(): Promise<void> {
  await syncBriefingsRegistry();
  console.log("Synced lib/data/briefings-registry.ts");
}

main().catch((error) => {
  console.error("Registry sync failed:", error);
  process.exit(1);
});
