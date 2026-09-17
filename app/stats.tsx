import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { BackChevron } from '../src/components/BackChevron';
import { getDecisions, getRerollCount } from '../src/lib/storage';
import { categoryCounts, computeStats, formatDuration, type CategoryCount, type Stats } from '../src/lib/stats';
import { colors, radius } from '../src/theme';

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

export default function StatsScreen() {
  const [stats, setStats] = useState<Stats>({ total: 0, secondsSaved: 0, streak: 0, rerolls: 0 });
  const [byCategory, setByCategory] = useState<CategoryCount[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all([getDecisions(), getRerollCount()]).then(([decisions, rerolls]) => {
        if (!active) return;
        setStats(computeStats(decisions, rerolls));
        setByCategory(categoryCounts(decisions));
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <Screen>
      <BackChevron label="menu" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>stats</Text>

        <View style={styles.grid}>
          <StatCard value={String(stats.total)} label="total decided" />
          <StatCard value={formatDuration(stats.secondsSaved)} label="time not deliberating" />
          <StatCard value={String(stats.streak)} label="no-reconsider streak" />
          <StatCard value={String(stats.rerolls)} label="times rerolled" />
        </View>

        {stats.rerolls > 0 && (
          <Text style={styles.shame}>rerolled. that's the overthinking talking.</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>most decided</Text>
          {byCategory.length === 0 ? (
            <Text style={styles.empty}>nothing yet.</Text>
          ) : (
            <View style={styles.pills}>
              {byCategory.map(({ category, count }) => (
                <View key={category} style={styles.pill}>
                  <Text style={styles.pillText}>
                    {category} <Text style={styles.pillCount}>{count}</Text>
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
    paddingBottom: 32,
    gap: 24,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 6,
  },
  cardValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  cardLabel: {
    color: colors.dim,
    fontSize: 13,
  },
  shame: {
    color: colors.accent,
    fontSize: 15,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    color: colors.dim,
    fontSize: 12,
    letterSpacing: 1,
  },
  empty: {
    color: colors.dim,
    fontSize: 13,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: colors.card,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    color: colors.text,
    fontSize: 10,
  },
  pillCount: {
    color: colors.dim,
  },
});
