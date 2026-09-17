import type { Category, Decision } from './types';

export const SECONDS_SAVED_PER_DECISION = 30;

export type Stats = {
  total: number;
  secondsSaved: number;
  streak: number;
  rerolls: number;
};

/** Consecutive tail of non-rerolled decisions, counting back from the most recent. */
export function noReconsiderStreak(decisions: Decision[]): number {
  const newestFirst = [...decisions].sort((a, b) => b.timestamp - a.timestamp);
  let streak = 0;
  for (const d of newestFirst) {
    if (d.rerolled) break;
    streak += 1;
  }
  return streak;
}

export function computeStats(decisions: Decision[], rerollCount: number): Stats {
  return {
    total: decisions.length,
    secondsSaved: decisions.length * SECONDS_SAVED_PER_DECISION,
    streak: noReconsiderStreak(decisions),
    rerolls: rerollCount,
  };
}

/** "Xh Ym" when an hour or more, otherwise "Xm". */
export function formatDuration(seconds: number): string {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export type CategoryCount = { category: Category; count: number };

/** Decision counts per category, sorted by count descending. */
export function categoryCounts(decisions: Decision[]): CategoryCount[] {
  const counts = new Map<Category, number>();
  for (const d of decisions) counts.set(d.category, (counts.get(d.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

export function relativeTime(timestamp: number, now: number = Date.now()): string {
  const diffMs = Math.max(0, now - timestamp);
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return 'yesterday';
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}
