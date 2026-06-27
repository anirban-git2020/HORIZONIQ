export function buildMetrics(current: number, previous: number | null) {
  const delta = previous === null ? null : current - previous;
  const deltaPercent =
    previous === null || previous === 0 || delta === null
      ? null
      : Math.round((delta / previous) * 100);
  return { current, previous, delta, deltaPercent };
}
