import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { BackChevron } from '../src/components/BackChevron';
import { getDecisions } from '../src/lib/storage';
import { relativeTime } from '../src/lib/stats';
import type { Decision } from '../src/lib/types';
import { colors } from '../src/theme';

function HistoryRow({ item, now }: { item: Decision; now: number }) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.pick} numberOfLines={1}>
          {item.pick}
        </Text>
        {item.rerolled && <Text style={styles.rerolled}>rerolled</Text>}
      </View>
      <Text style={styles.meta}>
        {item.category} · {relativeTime(item.timestamp, now)}
      </Text>
    </View>
  );
}

export default function HistoryScreen() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [now, setNow] = useState(() => Date.now());

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getDecisions().then((all) => {
        if (!active) return;
        setDecisions([...all].sort((a, b) => b.timestamp - a.timestamp));
        setNow(Date.now());
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <Screen>
      <BackChevron label="menu" />
      <Text style={styles.title}>history</Text>
      <FlatList
        data={decisions}
        keyExtractor={(d) => d.id}
        renderItem={({ item }) => <HistoryRow item={item} now={now} />}
        contentContainerStyle={decisions.length === 0 ? styles.emptyContainer : styles.list}
        ListEmptyComponent={<Text style={styles.empty}>no decisions yet.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
    paddingTop: 8,
    paddingBottom: 16,
  },
  list: {
    paddingBottom: 32,
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    color: colors.dim,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1e1e1e',
  },
  left: {
    flex: 1,
    gap: 3,
  },
  pick: {
    color: colors.text,
    fontSize: 13,
  },
  rerolled: {
    color: colors.accent,
    fontSize: 10,
  },
  meta: {
    color: colors.dim,
    fontSize: 10,
  },
});
