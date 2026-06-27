import { runPipeline } from "@/lib/pipeline/run";
import { runBriefingGenerator } from "@/lib/pipeline/generate/run";

async function main(): Promise<void> {
  console.log(
    "HorizonIQ Pipeline — ingest + briefing generation\n"
  );
  const started = Date.now();

  const ingest = await runPipeline();

  console.log("\n--- Ingest complete ---\n");
  for (const [source, status] of Object.entries(ingest.sourceStatus)) {
    console.log(`  ${source}: ${status}`);
  }

  console.log("\n--- Generating briefing ---\n");
  const briefing = await runBriefingGenerator();

  console.log(`Period:      ${briefing.briefingPeriod}`);
  console.log(`Provenance:  ${briefing.dataProvenance}`);
  console.log(`Briefing:    ${briefing.briefingPath}`);
  console.log(
    `Buckets:     new ${briefing.bucketCounts.new} · rising ${briefing.bucketCounts.rising} · falling ${briefing.bucketCounts.falling} · stable ${briefing.bucketCounts.stable}`
  );

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s`);
  console.log("Restart npm run dev to load updated briefing in the app.");
}

main().catch((error) => {
  console.error("Full pipeline failed:", error);
  process.exit(1);
});
