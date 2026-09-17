import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { getDecisionCount } from '../src/lib/storage';
import { colors } from '../src/theme';

export default function HomeScreen() {
  const router = useRouter();
  const [count, setCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getDecisionCount().then((n) => {
        if (active) setCount(n);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <Screen>
      <View style={styles.top}>
        <Pressable
          onPress={() => router.push('/menu')}
          hitSlop={16}
          accessibilityRole="button"
          accessibilityLabel="menu"
          style={styles.menu}
        >
          <View style={styles.bar} />
          <View style={styles.bar} />
          <View style={styles.bar} />
        </Pressable>
      </View>

      <View style={styles.middle}>
        <Text style={styles.headline}>stop overthinking.</Text>
        <Text style={styles.sub}>trivial decides. you move.</Text>
      </View>

      <View style={styles.bottom}>
        <Button
          label="i can't decide."
          onPress={() => router.push({ pathname: '/category', params: { startedAt: String(Date.now()) } })}
        />
        <Button
          label={`${count} ${count === 1 ? 'decision' : 'decisions'} made`}
          variant="ghost"
          onPress={() => router.push('/stats')}
        />
      </View>
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
  menu: {
    width: 22,
    gap: 5,
  },
  bar: {
    height: 1.5,
    backgroundColor: colors.text,
    borderRadius: 1,
  },
  middle: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  headline: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  sub: {
    color: colors.dim,
    fontSize: 17,
    fontWeight: '400',
  },
  bottom: {
    gap: 8,
    paddingBottom: 8,
  },
});
