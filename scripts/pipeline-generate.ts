import { runBriefingGenerator } from "@/lib/pipeline/generate/run";

async function main(): Promise<void> {
  console.log("HorizonIQ — Briefing generator\n");
  const result = await runBriefingGenerator();

  console.log(`Period:      ${result.briefingPeriod}`);
  console.log(`Provenance:  ${result.dataProvenance}`);
  console.log(`Briefing:    ${result.briefingPath}`);
  console.log(`Meta:        ${result.metaPath}`);
  console.log(
    `Buckets:     new ${result.bucketCounts.new} · rising ${result.bucketCounts.rising} · falling ${result.bucketCounts.falling} · stable ${result.bucketCounts.stable}`
  );
  if (result.topRisingSignalId) {
    console.log(`Top rising:  ${result.topRisingSignalId}`);
  }
  console.log("\nRestart npm run dev to load updated briefing in the app.");
}

main().catch((error) => {
  console.error("Briefing generation failed:", error);
  process.exit(1);
});
