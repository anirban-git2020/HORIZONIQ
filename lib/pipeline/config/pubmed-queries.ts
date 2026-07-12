import type { InterestId } from "@/lib/types";

/**
 * PubMed (NCBI E-utilities) query terms — the biomedical evidence lens.
 *
 * Layer B domain provider. PubMed only covers the life-science interests; it
 * contributes evidence to those and is absent elsewhere (the scorer skips any
 * interest a source does not report, so there is no dilution).
 *
 * Terms are deliberately aligned with the curated editorial for each signal so
 * live medical evidence moves the same story the brief tells — not "AI + X".
 * Syntax uses PubMed field tags; [tiab] = title/abstract.
 */
export interface PubMedQueryConfig {
  readonly interestId: InterestId;
  readonly label: string;
  readonly term: string;
}

export const PUBMED_QUERIES: readonly PubMedQueryConfig[] = [
  {
    interestId: "healthcare",
    label: "Metabolic Medicine",
    term: '"GLP-1"[tiab] OR "glucagon-like peptide"[tiab] OR "obesity"[tiab] OR "metabolic disease"[tiab]',
  },
  {
    interestId: "biotechnology",
    label: "Gene & Cell Therapy",
    term: '"gene therapy"[tiab] OR "CRISPR"[tiab] OR "cell therapy"[tiab] OR "gene editing"[tiab]',
  },
  {
    interestId: "biochemistry",
    label: "Protein Engineering",
    term: '"protein engineering"[tiab] OR "enzyme engineering"[tiab] OR "de novo protein"[tiab] OR "biocatalysis"[tiab]',
  },
  {
    interestId: "life-sciences",
    label: "Single-Cell Biology",
    term: '"single-cell"[tiab] OR "single cell RNA"[tiab] OR "spatial transcriptomics"[tiab] OR "single-cell sequencing"[tiab]',
  },
];
