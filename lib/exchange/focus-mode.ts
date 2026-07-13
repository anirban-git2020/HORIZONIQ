import { getPulseBrief } from "@/lib/exchange/pulse-brief-data";
import {
  INTELLIGENCE_PULSE_TILES,
  type IntelligencePulseTile,
} from "@/lib/exchange/pulse-mock-data";

/** Map brief related-signal labels to pulse tile ids. */
export function getRelatedTileIds(focusedTileId: string): Set<string> {
  const brief = getPulseBrief(focusedTileId);
  if (!brief) return new Set();

  const related = new Set<string>();

  for (const label of brief.relatedSignals) {
    const normalized = label.toLowerCase();
    const match = INTELLIGENCE_PULSE_TILES.find((tile) => {
      const tech = tile.technology.toLowerCase();
      return (
        tech === normalized ||
        tech.includes(normalized) ||
        normalized.includes(tech)
      );
    });
    if (match && match.id !== focusedTileId) {
      related.add(match.id);
    }
  }

  return related;
}

export function getAllPulseTiles(): IntelligencePulseTile[] {
  return INTELLIGENCE_PULSE_TILES;
}
