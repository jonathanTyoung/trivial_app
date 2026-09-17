import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Decision } from './types';

const DECISIONS_KEY = 'trivial_decisions';
const REROLL_KEY = 'trivial_reroll_count';

export async function getDecisions(): Promise<Decision[]> {
  try {
    const raw = await AsyncStorage.getItem(DECISIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Decision[]) : [];
  } catch {
    return [];
  }
}

export async function saveDecision(decision: Decision): Promise<void> {
  const all = await getDecisions();
  all.push(decision);
  await AsyncStorage.setItem(DECISIONS_KEY, JSON.stringify(all));
}

export async function getDecisionCount(): Promise<number> {
  return (await getDecisions()).length;
}

export async function getRerollCount(): Promise<number> {
  try {
    const raw = await AsyncStorage.getItem(REROLL_KEY);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export async function incrementRerollCount(): Promise<number> {
  const next = (await getRerollCount()) + 1;
  await AsyncStorage.setItem(REROLL_KEY, String(next));
  return next;
}

/** Sum of seconds spent deciding on decisions timestamped yesterday (local time). */
export async function getSecondsSpentYesterday(): Promise<number | null> {
  const all = await getDecisions();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const from = startOfYesterday.getTime();
  const to = startOfToday.getTime();
  const yesterday = all.filter((d) => d.timestamp >= from && d.timestamp < to);
  if (yesterday.length === 0) return null;
  return yesterday.reduce((sum, d) => sum + d.timeToDecide, 0);
}

export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
