import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { colors } from '../src/theme';

// placeholder for phase 2: avatar, stats / history / unlock rows, version string
export default function MenuScreen() {
  const router = useRouter();
  return (
    <Screen>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={16} accessibilityRole="button">
          <Text style={styles.close}>×</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>menu</Text>
        <Pressable onPress={() => router.push('/stats')} style={styles.row} accessibilityRole="button">
          <Text style={styles.rowLabel}>stats</Text>
          <Text style={styles.chevron}>→</Text>
        </Pressable>
        <Text style={styles.soon}>history, unlock, and the rest are coming in phase 2.</Text>
      </View>
      <Text style={styles.version}>v1.0 · greenfieldtech.dev</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  close: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 30,
  },
  body: {
    flex: 1,
    paddingTop: 16,
    gap: 16,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    color: colors.text,
    fontSize: 17,
  },
  chevron: {
    color: colors.dim,
    fontSize: 17,
  },
  soon: {
    color: colors.dim,
    fontSize: 15,
  },
  version: {
    color: colors.dim,
    fontSize: 13,
    textAlign: 'center',
    paddingBottom: 8,
  },
});
