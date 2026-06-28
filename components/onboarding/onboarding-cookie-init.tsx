import { ONBOARDING_COOKIE_NAME } from "@/lib/onboarding-phase";

/**
 * Runs before React. Sets step cookie if missing.
 * Never reads localStorage to skip ahead — only migrates fully complete users.
 */
export const ONBOARDING_COOKIE_INIT_SCRIPT = `
(function () {
  try {
    var name = ${JSON.stringify(ONBOARDING_COOKIE_NAME)};
    if (document.cookie.indexOf(name + "=") !== -1) return;

    var legacy = ["horizoniq_phase","horizoniq_phase_v1","horizoniq_phase_v2"];
    for (var i = 0; i < legacy.length; i++) {
      document.cookie = legacy[i] + "=;path=/;max-age=0;SameSite=Lax";
    }

    var onboarding = localStorage.getItem("horizoniq.onboarding.v1");
    var prefs = localStorage.getItem("horizoniq.preferences.v2");
    var step = "welcome";

    if (onboarding && prefs) {
      try {
        var r = JSON.parse(onboarding);
        var p = JSON.parse(prefs);
        if (
          r.welcomeCompletedAt &&
          r.displayName &&
          r.landingAcknowledgedAt &&
          p.role &&
          p.region &&
          p.interests &&
          p.interests.length > 0
        ) {
          step = "complete";
        }
      } catch (e) {}
    }

    if (step === "welcome") {
      localStorage.removeItem("horizoniq.onboarding.v1");
      localStorage.removeItem("horizoniq.identity.v1");
      localStorage.removeItem("horizoniq.preferences.v2");
      localStorage.removeItem("horizoniq.preferences.v1");
      localStorage.removeItem("horizoniq.onboarding.flowVersion");
      localStorage.removeItem("horizoniq-visit-snapshot");
    }

    document.cookie = name + "=" + step + ";path=/;max-age=31536000;SameSite=Lax";
  } catch (e) {}
})();
`;
