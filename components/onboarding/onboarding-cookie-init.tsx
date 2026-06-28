import { ONBOARDING_COOKIE_NAME } from "@/lib/onboarding-phase";

/** Runs before React — sets phase cookie so middleware and client agree. */
export const ONBOARDING_COOKIE_INIT_SCRIPT = `
(function () {
  try {
    var name = ${JSON.stringify(ONBOARDING_COOKIE_NAME)};
    if (document.cookie.indexOf(name + "=") !== -1) return;

    var onboarding = localStorage.getItem("horizoniq.onboarding.v1");
    var prefs = localStorage.getItem("horizoniq.preferences.v2");
    var phase = "welcome";

    if (onboarding && prefs) {
      var record = JSON.parse(onboarding);
      var profile = JSON.parse(prefs);
      if (
        record.welcomeCompletedAt &&
        record.displayName &&
        record.landingAcknowledgedAt &&
        profile.role &&
        profile.region &&
        profile.interests &&
        profile.interests.length > 0
      ) {
        phase = "complete";
      }
    }

    if (phase === "welcome") {
      localStorage.removeItem("horizoniq.onboarding.v1");
      localStorage.removeItem("horizoniq.identity.v1");
      localStorage.removeItem("horizoniq.onboarding.flowVersion");
    }

    document.cookie =
      name + "=" + phase + ";path=/;max-age=31536000;SameSite=Lax";
  } catch (e) {}
})();
`;
