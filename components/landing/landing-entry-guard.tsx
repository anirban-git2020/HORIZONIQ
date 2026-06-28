/** Landing access is enforced by middleware — no client redirect needed. */
export function LandingEntryGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
