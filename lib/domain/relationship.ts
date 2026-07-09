/**
 * Relationship — the connective model of the Intelligence Layer.
 *
 * Signals are related to other Signals by typed, weighted edges. This is the
 * architecture the future Relationship Engine and graph visualization consume.
 * Edges reference Signals by id only, so this module never imports Signal —
 * keeping the graph model free of cycles.
 */

export type RelationshipKind =
  | "depends-on"
  | "enables"
  | "competes-with"
  | "influences"
  | "part-of"
  | "related";

export type SignalRelationship = {
  readonly fromSignalId: string;
  readonly toSignalId: string;
  readonly kind: RelationshipKind;
  /** Edge strength, 0..1. */
  readonly strength: number;
  /** True for a directed edge (from → to); false for a symmetric association. */
  readonly directed: boolean;
};
