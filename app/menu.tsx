import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { colors } from '../src/theme';

type Row = {
  key: string;
  icon: string;
  label: string;
  subtext?: string;
  href: Href;
  accent?: boolean;
};

const ROWS: Row[] = [
  { key: 'stats', icon: '#', label: 'stats', href: '/stats' },
  { key: 'history', icon: '≡', label: 'history', href: '/history' },
  {
    key: 'unlock',
    icon: '★',
    label: 'unlock trivial',
    subtext: 'custom lists · saved options',
    href: '/unlock',
    accent: true,
  },
];

export default function MenuScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel="close menu"
        >
          <Text style={styles.close}>×</Text>
        </Pressable>
      </View>

      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>J</Text>
        </View>
        <View style={styles.profileText}>
          <Text style={styles.name}>jon</Text>
          <Text style={styles.since}>overthinking less since sep 2026</Text>
        </View>
      </View>

      <View style={styles.rows}>
        {ROWS.map((row, i) => (
          <Pressable
            key={row.key}
            onPress={() => router.push(row.href)}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.row,
              i < ROWS.length - 1 && styles.rowBorder,
              pressed && styles.rowPressed,
            ]}
          >
            <View style={styles.iconCircle}>
              <Text style={[styles.icon, row.accent && styles.accentText]}>{row.icon}</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={[styles.rowLabel, row.accent && styles.accentText]}>{row.label}</Text>
              {row.subtext && <Text style={styles.rowSub}>{row.subtext}</Text>}
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
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
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 16,
    paddingBottom: 32,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '500',
  },
  profileText: {
    gap: 3,
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '500',
  },
  since: {
    color: colors.dim,
    fontSize: 13,
  },
  rows: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.card,
  },
  rowPressed: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: colors.text,
    fontSize: 14,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    color: colors.text,
    fontSize: 17,
  },
  rowSub: {
    color: colors.dim,
    fontSize: 13,
  },
  accentText: {
    color: colors.accent,
  },
  chevron: {
    color: '#333330',
    fontSize: 22,
    lineHeight: 24,
  },
  version: {
    color: colors.dim,
    fontSize: 13,
    textAlign: 'center',
    paddingBottom: 8,
  },
});
