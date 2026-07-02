export interface WeekRange {
  start: Date;
  end: Date;
}

export interface ComparisonRanges {
  current: WeekRange;
  previous: WeekRange;
}

function getISOWeekParts(date: Date): { year: number; week: number } {
  const utc = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  utc.setUTCDate(utc.getUTCDate() + 4 - (utc.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7
  );
  return { year: utc.getUTCFullYear(), week };
}

export function formatBriefingPeriod(date = new Date()): string {
  const { year, week } = getISOWeekParts(date);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** Monday (UTC) of the ISO week encoded as `YYYY-Www`. */
export function parseBriefingPeriod(period: string): Date | null {
  const match = /^(\d{4})-W(\d{2})$/.exec(period);
  if (!match) return null;

  const year = Number(match[1]);
  const week = Number(match[2]);
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7;
  const mondayOfWeek1 = new Date(jan4);
  mondayOfWeek1.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1);
  const monday = new Date(mondayOfWeek1);
  monday.setUTCDate(mondayOfWeek1.getUTCDate() + (week - 1) * 7);
  return monday;
}

export function getPreviousBriefingPeriod(period: string): string | null {
  const monday = parseBriefingPeriod(period);
  if (!monday) return null;
  const previousMonday = new Date(monday);
  previousMonday.setUTCDate(previousMonday.getUTCDate() - 7);
  return formatBriefingPeriod(previousMonday);
}

export function formatBriefingLabel(date = new Date()): string {
  const { start, end } = getWeekRange(date);
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `Week of ${formatter.format(start)} – ${formatter.format(end)}`;
}

export function getWeekRange(date = new Date()): WeekRange {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  start.setDate(d.getDate() + diffToMonday);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export function getComparisonRanges(date = new Date()): ComparisonRanges {
  const current = getWeekRange(date);
  const previousEnd = new Date(current.start);
  previousEnd.setDate(previousEnd.getDate() - 1);
  previousEnd.setHours(23, 59, 59, 999);
  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - 6);
  previousStart.setHours(0, 0, 0, 0);
  return {
    current,
    previous: { start: previousStart, end: previousEnd },
  };
}

export function toArxivDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

export function toWikimediaDate(date: Date): string {
  return toArxivDate(date);
}

export function getLaggedComparisonRanges(
  lagDays = 7,
  date = new Date()
): ComparisonRanges {
  const anchor = new Date(date);
  anchor.setDate(anchor.getDate() - lagDays);
  return getComparisonRanges(anchor);
}

export function toUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}
