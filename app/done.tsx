import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { getDecisions, getSecondsSpentYesterday } from '../src/lib/storage';
import type { Decision } from '../src/lib/types';
import { colors, radius } from '../src/theme';

function shameLine(seconds: number | null): string {
  if (seconds === null) return "no history yet. that's about to change.";
  const minutes = seconds / 60;
  const shown = minutes < 1 ? '<1' : minutes < 10 ? minutes.toFixed(1) : String(Math.round(minutes));
  return `you spent ${shown} ${shown === '1.0' ? 'minute' : 'minutes'} on this yesterday.`;
}

export default function DoneScreen() {
  const router = useRouter();
  const [latest, setLatest] = useState<Decision | null>(null);
  const [recent, setRecent] = useState<Decision[]>([]);
  const [yesterday, setYesterday] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getDecisions(), getSecondsSpentYesterday()]).then(([all, secs]) => {
      if (!active) return;
      const sorted = [...all].sort((a, b) => b.timestamp - a.timestamp);
      setLatest(sorted[0] ?? null);
      setRecent(sorted.slice(0, 3));
      setYesterday(secs);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  return (
    <Screen>
      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.time}>{latest ? `${latest.timeToDecide}s` : '—'}</Text>
          <Text style={styles.decidedIn}>decided in</Text>
        </View>

        <Text style={styles.shame}>{shameLine(yesterday)}</Text>

        {recent.length > 0 && (
          <View style={styles.history}>
            <Text style={styles.historyLabel}>last {recent.length === 1 ? 'decision' : 'decisions'}</Text>
            {recent.map((d) => (
              <View key={d.id} style={styles.historyRow}>
                <Text style={styles.historyPick} numberOfLines={1}>
                  {d.pick}
                </Text>
                <Text style={styles.historyMeta}>
                  {d.category} · {d.timeToDecide}s{d.rerolled ? ' · rerolled' : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        <Button label="done." onPress={() => router.dismissAll()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: 32,
    gap: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 36,
    alignItems: 'center',
    gap: 6,
  },
  time: {
    color: colors.text,
    fontSize: 56,
    fontWeight: '500',
    letterSpacing: -1,
  },
  decidedIn: {
    color: colors.dim,
    fontSize: 15,
  },
  shame: {
    color: colors.dim,
    fontSize: 15,
  },
  history: {
    gap: 12,
  },
  historyLabel: {
    color: colors.dim,
    fontSize: 12,
    letterSpacing: 1,
  },
  historyRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 4,
  },
  historyPick: {
    color: colors.text,
    fontSize: 17,
  },
  historyMeta: {
    color: colors.dim,
    fontSize: 13,
  },
  bottom: {
    paddingBottom: 8,
  },
});
