export type FocusAnchor = {
  x: number;
  y: number;
  radius: number;
};

/** @deprecated Epic 8.1 — overlay architecture; optional hook retained for Living Intelligence Field only. */
export function useFocusModeOptional(): { focusAnchor: FocusAnchor | null } | null {
  return null;
}
