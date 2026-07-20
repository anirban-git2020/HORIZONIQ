import {
  ONBOARDING_COOKIE_NAME,
} from "@/lib/onboarding-phase";
import { PUBLIC_SITE_PATH_PREFIXES } from "@/lib/site";
import { ONBOARDING_SCHEMA_VERSION, SCHEMA_VERSION_KEY } from "@/lib/onboarding-reconcile";

/**
 * Runs before React on every page load.
 * Reconciles hziq_ob_v3 cookie with localStorage — repairs stale cookies
 * (e.g. profile with empty prefs) without DevTools or incognito.
 */
export const ONBOARDING_COOKIE_INIT_SCRIPT = `
(function () {
  try {
    var COOKIE = ${JSON.stringify(ONBOARDING_COOKIE_NAME)};
    var SCHEMA = ${JSON.stringify(SCHEMA_VERSION_KEY)};
    var SCHEMA_VER = ${ONBOARDING_SCHEMA_VERSION};
    var ONE_YEAR = 31536000;
    var legacyCookies = ["horizoniq_phase","horizoniq_phase_v1","horizoniq_phase_v2"];
    var legacyStorage = ["horizoniq.identity.v1","horizoniq.onboarding.flowVersion","horizoniq.preferences.v1"];

    for (var i = 0; i < legacyCookies.length; i++) {
      document.cookie = legacyCookies[i] + "=;path=/;max-age=0;SameSite=Lax";
    }
    for (var j = 0; j < legacyStorage.length; j++) {
      localStorage.removeItem(legacyStorage[j]);
    }

    function readCookiePhase() {
      var parts = document.cookie.split("; ");
      for (var i = 0; i < parts.length; i++) {
        if (parts[i].indexOf(COOKIE + "=") === 0) {
          var v = parts[i].split("=")[1];
          if (v === "welcome" || v === "name" || v === "landing" || v === "profile" || v === "complete") {
            return v;
          }
        }
      }
      return null;
    }

    function setCookiePhase(phase) {
      document.cookie = COOKIE + "=" + phase + ";path=/;max-age=" + ONE_YEAR + ";SameSite=Lax";
    }

    function emptyRecord() {
      return {
        displayName: null,
        welcomeCompletedAt: null,
        welcomeSkipped: false,
        landingAcknowledgedAt: null,
        tourChoice: null,
        guidedTourCompletedAt: null
      };
    }

    function readRecord() {
      var raw = localStorage.getItem("horizoniq.onboarding.v1");
      if (!raw) return emptyRecord();
      try {
        var p = JSON.parse(raw);
        var r = emptyRecord();
        for (var k in r) {
          if (Object.prototype.hasOwnProperty.call(p, k)) r[k] = p[k];
        }
        if (typeof r.displayName === "string") {
          r.displayName = r.displayName.trim() || null;
        }
        return r;
      } catch (e) {
        return emptyRecord();
      }
    }

    function readPrefs() {
      var raw = localStorage.getItem("horizoniq.preferences.v2");
      if (!raw) return { role: null, region: null, interests: [] };
      try {
        var p = JSON.parse(raw);
        return {
          role: p.role || null,
          region: p.region || null,
          interests: Array.isArray(p.interests) ? p.interests : []
        };
      } catch (e) {
        return { role: null, region: null, interests: [] };
      }
    }

    function isProfileComplete(prefs) {
      return prefs.role && prefs.region && prefs.interests && prefs.interests.length > 0;
    }

    function isValidChain(r) {
      if (r.displayName && !r.welcomeCompletedAt) return false;
      if (r.landingAcknowledgedAt && !r.welcomeCompletedAt) return false;
      if (r.landingAcknowledgedAt && !r.displayName) return false;
      if (r.tourChoice && !r.landingAcknowledgedAt) return false;
      if (r.guidedTourCompletedAt && r.tourChoice !== "guided") return false;
      return true;
    }

    function repairRecord(r) {
      if (!isValidChain(r)) return emptyRecord();
      if (!r.welcomeCompletedAt) return emptyRecord();
      if (!r.displayName) {
        return {
          welcomeCompletedAt: r.welcomeCompletedAt,
          welcomeSkipped: r.welcomeSkipped,
          displayName: null,
          landingAcknowledgedAt: null,
          tourChoice: null,
          guidedTourCompletedAt: null
        };
      }
      if (!r.landingAcknowledgedAt) {
        return {
          welcomeCompletedAt: r.welcomeCompletedAt,
          welcomeSkipped: r.welcomeSkipped,
          displayName: r.displayName,
          landingAcknowledgedAt: null,
          tourChoice: null,
          guidedTourCompletedAt: null
        };
      }
      return r;
    }

    function isStrictlyComplete(r, prefs) {
      return (
        r.welcomeCompletedAt &&
        r.displayName &&
        r.landingAcknowledgedAt &&
        isProfileComplete(prefs)
      );
    }

    function deriveCanonical(r, prefs) {
      if (!isValidChain(r)) {
        return { phase: "welcome", record: emptyRecord(), wipePrefs: true };
      }
      var repaired = repairRecord(r);
      if (isStrictlyComplete(repaired, prefs)) {
        return { phase: "complete", record: repaired, wipePrefs: false };
      }
      if (isProfileComplete(prefs)) {
        return { phase: "profile", record: repaired, wipePrefs: false };
      }
      if (repaired.landingAcknowledgedAt) {
        return { phase: "profile", record: repaired, wipePrefs: false };
      }
      if (repaired.displayName) {
        return { phase: "landing", record: repaired, wipePrefs: false };
      }
      if (repaired.welcomeCompletedAt) {
        return { phase: "name", record: repaired, wipePrefs: false };
      }
      return { phase: "welcome", record: repaired, wipePrefs: false };
    }

    // MUST mirror lib/onboarding-phase.ts. The Landing Experience at "/" owns all
    // pre-completion onboarding; legacy /onboarding/* is retired. Every incomplete
    // phase resolves to "/", so this pre-React script never bounces "/" away.
    var pathPrefixes = {
      welcome: ["/"],
      name: ["/"],
      landing: ["/"],
      profile: ["/"],
      complete: ["/", "/dashboard"]
    };

    function pathForPhase(phase) {
      return phase === "complete" ? "/dashboard" : "/";
    }

    var publicPaths = ${JSON.stringify([...PUBLIC_SITE_PATH_PREFIXES])};

    function isPublicPath(pathname) {
      for (var p = 0; p < publicPaths.length; p++) {
        var pub = publicPaths[p];
        if (pathname === pub || pathname.indexOf(pub + "/") === 0) return true;
      }
      return false;
    }

    function pathAllowed(pathname, phase) {
      if (isPublicPath(pathname)) return true;
      var list = pathPrefixes[phase] || [];
      for (var i = 0; i < list.length; i++) {
        var prefix = list[i];
        if (pathname === prefix || pathname.indexOf(prefix + "/") === 0) return true;
      }
      return false;
    }

    var record = readRecord();
    var prefs = readPrefs();
    var cookiePhase = readCookiePhase();
    var derived = deriveCanonical(record, prefs);
    var canonical = derived.phase;
    var repaired = cookiePhase !== canonical;

    localStorage.setItem("horizoniq.onboarding.v1", JSON.stringify(derived.record));
    if (derived.wipePrefs) {
      localStorage.removeItem("horizoniq.preferences.v2");
      localStorage.removeItem("horizoniq-visit-snapshot");
    }
    if (repaired || !cookiePhase) {
      setCookiePhase(canonical);
    }
    localStorage.setItem(SCHEMA, String(SCHEMA_VER));

    var pathname = window.location.pathname;
    if (!pathAllowed(pathname, canonical)) {
      window.location.replace(pathForPhase(canonical));
    }
  } catch (e) {}
})();
`;
