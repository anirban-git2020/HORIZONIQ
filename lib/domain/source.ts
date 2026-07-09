/**
 * Source — the canonical evidence-origin entity for the Intelligence Layer.
 *
 * A Source is where an observation comes from. The type union is intentionally
 * extensible: adding a provider (a new blog network, a patents feed) is a new
 * member here, never a new competing model.
 */

export type SourceType =
  | "github"
  | "arxiv"
  | "wikipedia"
  | "engineering-blog"
  | "research-paper"
  | "patent"
  | "job-board"
  | "product-hunt"
  | "hacker-news"
  | "news"
  | "forum"
  | "social";

/** A fully-described source of evidence. */
export type Source = {
  readonly id: string;
  readonly type: SourceType;
  readonly label: string;
  readonly url?: string;
  readonly observedAt?: string; // ISO 8601
};

/**
 * A lightweight reference to a source, embeddable directly on a Signal's
 * evidence. Carries an optional observed delta (e.g. "+214%") so the Evidence
 * Engine can express change without a separate lookup.
 */
export type SourceRef = {
  readonly type: SourceType;
  readonly label: string;
  readonly url?: string;
  readonly delta?: string;
};
