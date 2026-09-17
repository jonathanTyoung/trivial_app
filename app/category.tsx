import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { CATEGORIES, type Category } from '../src/lib/types';
import { colors, radius } from '../src/theme';

export default function CategoryScreen() {
  const router = useRouter();
  const { startedAt } = useLocalSearchParams<{ startedAt?: string }>();
  const [selected, setSelected] = useState<Category | null>(null);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>what's it about?</Text>
      </View>

      <View style={styles.grid}>
        {CATEGORIES.map((c) => {
          const on = c === selected;
          return (
            <Pressable
              key={c}
              onPress={() => setSelected(c)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={[styles.chip, on && styles.chipOn]}
            >
              <Text style={[styles.chipLabel, on && styles.chipLabelOn]}>{c}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.bottom}>
        <Button
          label="next"
          disabled={!selected}
          onPress={() => {
            if (!selected) return;
            router.push({
              pathname: '/options',
              params: { category: selected, startedAt: startedAt ?? String(Date.now()) },
            });
          }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 32,
    paddingBottom: 32,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignContent: 'flex-start',
  },
  chip: {
    width: '48%',
    flexGrow: 1,
    height: 64,
    borderRadius: radius.card,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipOn: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  chipLabel: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '400',
  },
  chipLabelOn: {
    color: colors.bg,
    fontWeight: '500',
  },
  bottom: {
    paddingBottom: 8,
  },
});
