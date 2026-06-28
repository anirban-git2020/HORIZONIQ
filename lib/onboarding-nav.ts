/**
 * Full-page navigation for onboarding phase transitions.
 * Client-side router.push/replace does not reliably cross middleware phase
 * boundaries after the phase cookie is updated — use this instead.
 */
export function navigateOnboarding(path: string): void {
  window.location.assign(path);
}
