export type IntelligenceFieldVariant = "welcome" | "hero" | "ambient";

/** `css` = procedural fallback only. `webgl` = Living Core. `auto` = webgl on welcome only. */
export type IntelligenceFieldMode = "css" | "webgl" | "auto";

export const FIELD_INTENSITY: Record<IntelligenceFieldVariant, number> = {
  welcome: 0.9,
  hero: 0.88,
  ambient: 0.32,
};
