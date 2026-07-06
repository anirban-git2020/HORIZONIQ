import type { SessionArchiveEntry, SessionId, SessionRecord, VisitorId } from "./types";
import { getOrCreateVisitorId } from "./visitor";

const CURRENT_SESSION_KEY = "horizoniq.analytics.session.v1";
const SESSION_ARCHIVE_KEY = "horizoniq.analytics.sessions.v1";
const MAX_ARCHIVED_SESSIONS = 50;

const isBrowser = (): boolean => typeof window !== "undefined";

function generateSessionId(): SessionId {
  if (isBrowser() && typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}`;
}

function readCurrentSession(): SessionRecord | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.sessionStorage.getItem(CURRENT_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionRecord;
  } catch {
    return null;
  }
}

function writeCurrentSession(session: SessionRecord): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage unavailable — session tracking must never break the app.
  }
}

function archiveSession(session: SessionRecord): void {
  if (!isBrowser() || !session.endedAt || session.durationMs === undefined) return;

  try {
    const raw = window.localStorage.getItem(SESSION_ARCHIVE_KEY);
    const archive: SessionArchiveEntry[] = raw ? (JSON.parse(raw) as SessionArchiveEntry[]) : [];
    archive.push(session as SessionArchiveEntry);
    if (archive.length > MAX_ARCHIVED_SESSIONS) {
      archive.splice(0, archive.length - MAX_ARCHIVED_SESSIONS);
    }
    window.localStorage.setItem(SESSION_ARCHIVE_KEY, JSON.stringify(archive));
  } catch {
    // Ignore archive failures.
  }
}

/** Begin or resume the current browser session. */
export function startSession(path: string): SessionRecord {
  const existing = readCurrentSession();
  if (existing) {
    if (!existing.pages.includes(path)) {
      existing.pages.push(path);
      existing.lastPath = path;
      writeCurrentSession(existing);
    }
    return existing;
  }

  const visitorId = getOrCreateVisitorId() as VisitorId;
  const session: SessionRecord = {
    sessionId: generateSessionId(),
    visitorId,
    startedAt: new Date().toISOString(),
    pages: [path],
    eventCount: 0,
    lastPath: path,
  };
  writeCurrentSession(session);
  return session;
}

/** Record a page view on the active session. */
export function recordSessionPage(path: string): void {
  const session = readCurrentSession();
  if (!session) {
    startSession(path);
    return;
  }
  if (!session.pages.includes(path)) {
    session.pages.push(path);
  }
  session.lastPath = path;
  writeCurrentSession(session);
}

/** Increment event count for the active session. */
export function incrementSessionEventCount(): void {
  const session = readCurrentSession();
  if (!session) return;
  session.eventCount += 1;
  writeCurrentSession(session);
}

export function getCurrentSession(): SessionRecord | null {
  return readCurrentSession();
}

export function getSessionElapsedMs(): number | null {
  const session = readCurrentSession();
  if (!session) return null;
  const start = Date.parse(session.startedAt);
  if (Number.isNaN(start)) return null;
  return Date.now() - start;
}

/** End session on tab close — archived locally for future backend sync. */
export function endSession(): void {
  const session = readCurrentSession();
  if (!session) return;

  const endedAt = new Date().toISOString();
  const durationMs = getSessionElapsedMs() ?? 0;
  const closed: SessionRecord = { ...session, endedAt, durationMs };

  archiveSession(closed);

  try {
    window.sessionStorage.removeItem(CURRENT_SESSION_KEY);
  } catch {
    // Ignore.
  }
}

export function getArchivedSessions(): SessionArchiveEntry[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(SESSION_ARCHIVE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SessionArchiveEntry[]) : [];
  } catch {
    return [];
  }
}

const SIGNAL_SOURCE_KEY = "horizoniq.analytics.signal-source";

export type { SignalSource } from "./events";

/** Remember where a signal-detail navigation came from (read once on detail page). */
export function rememberSignalSource(source: import("./events").SignalSource): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(SIGNAL_SOURCE_KEY, source);
  } catch {
    // Ignore.
  }
}

export function consumeSignalSource(): import("./events").SignalSource {
  if (!isBrowser()) return "direct";
  try {
    const value = window.sessionStorage.getItem(SIGNAL_SOURCE_KEY);
    window.sessionStorage.removeItem(SIGNAL_SOURCE_KEY);
    return (value as import("./events").SignalSource | null) ?? "direct";
  } catch {
    return "direct";
  }
}
