import type { AnalyticsEventName, AnalyticsEventProps } from "./events";

/** Opaque anonymous visitor identifier (UUID v4). */
export type VisitorId = string;

/** Opaque session identifier (UUID v4). */
export type SessionId = string;

export interface AnalyticsEvent<
  N extends AnalyticsEventName = AnalyticsEventName,
> {
  name: N;
  props: AnalyticsEventProps[N];
  ts: string;
  visitorId: VisitorId | null;
  sessionId: SessionId | null;
}

export type AnalyticsSink = (event: AnalyticsEvent) => void;

/** Current in-browser session — supports future backend sync. */
export interface SessionRecord {
  sessionId: SessionId;
  visitorId: VisitorId;
  startedAt: string;
  endedAt?: string;
  durationMs?: number;
  pages: string[];
  eventCount: number;
  lastPath: string;
}

/** Payload shape for archived sessions in localStorage. */
export interface SessionArchiveEntry extends SessionRecord {
  endedAt: string;
  durationMs: number;
}
