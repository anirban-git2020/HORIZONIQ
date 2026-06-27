import { runPipeline } from "@/lib/pipeline/run";

async function main(): Promise<void> {
  console.log(
    "HorizonIQ Pipeline — HN + arXiv + Wikimedia + GitHub + Product Hunt\n"
  );
  const started = Date.now();

  const result = await runPipeline();

  console.log("Source status:");
  for (const [source, status] of Object.entries(result.sourceStatus)) {
    console.log(`  ${source}: ${status}`);
    const error = result.sourceErrors[source as keyof typeof result.sourceErrors];
    if (error && status === "failed") {
      console.log(`    → ${error}`);
    }
  }

  console.log(`\nObservations: ${result.observationsPath}`);
  console.log(`Scores:       ${result.scoresPath}`);

  if (result.topRising.length > 0) {
    console.log("\nTop rising interests:");
    for (const entry of result.topRising) {
      console.log(
        `  ${entry.interest} — momentum ${entry.momentum}, confidence ${entry.confidence}`
      );
    }
  } else {
    console.log("\nNo interests crossed the rising threshold this week.");
  }

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\nDone in ${elapsed}s`);
}

main().catch((error) => {
  console.error("Pipeline ingest failed:", error);
  process.exit(1);
});
