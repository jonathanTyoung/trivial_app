import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { colors } from '../src/theme';

// placeholder for phase 2: 2x2 stat grid, reroll shame line, "most decided" breakdown
export default function StatsScreen() {
  const router = useRouter();
  return (
    <Screen>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} hitSlop={16} accessibilityRole="button">
          <Text style={styles.back}>←</Text>
        </Pressable>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>stats</Text>
        <Text style={styles.soon}>coming in phase 2.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: {
    height: 44,
    justifyContent: 'center',
  },
  back: {
    color: colors.text,
    fontSize: 24,
  },
  body: {
    flex: 1,
    paddingTop: 16,
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
  },
  soon: {
    color: colors.dim,
    fontSize: 15,
  },
});
