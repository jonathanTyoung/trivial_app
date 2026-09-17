import { useEffect, useRef, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import { Screen } from '../src/components/Screen';
import { CountdownRing } from '../src/components/CountdownRing';
import { pickRandom } from '../src/lib/pick';
import { incrementRerollCount, makeId, saveDecision } from '../src/lib/storage';
import type { Category } from '../src/lib/types';
import { colors } from '../src/theme';

const COUNTDOWN_MS = 10_000;
const REROLL_UNLOCK_MS = 2_000;
const SHAKE_THRESHOLD_G = 2.2;

function parseOptions(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((o): o is string => typeof o === 'string') : [];
  } catch {
    return [];
  }
}

export default function PickScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    category?: Category;
    options?: string;
    mode?: 'own' | 'suggest';
    startedAt?: string;
  }>();
  const category: Category = params.category ?? 'anything';
  const optionsRef = useRef<string[]>(parseOptions(params.options));
  const startedAt = Number(params.startedAt) || Date.now();

  const [pick, setPick] = useState<string>(() => pickRandom(optionsRef.current.length ? optionsRef.current : ['just go']));
  const [runKey, setRunKey] = useState(0);
  const [canReroll, setCanReroll] = useState(false);
  const [rerolled, setRerolled] = useState(false);

  const pickRef = useRef(pick);
  const rerolledRef = useRef(false);
  const finishedRef = useRef(false);
  pickRef.current = pick;

  // heavy haptic on the pick moment
  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  }, [runKey]);

  // countdown timer + reroll unlock, restarted on every run
  useEffect(() => {
    finishedRef.current = false;
    setCanReroll(false);

    const unlock = setTimeout(() => {
      if (!rerolledRef.current) setCanReroll(true);
    }, REROLL_UNLOCK_MS);

    const end = setTimeout(async () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const timestamp = Date.now();
      await saveDecision({
        id: makeId(),
        pick: pickRef.current,
        category,
        options: optionsRef.current,
        timeToDecide: Math.max(1, Math.round((timestamp - startedAt) / 1000)),
        rerolled: rerolledRef.current,
        timestamp,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      router.replace('/done');
    }, COUNTDOWN_MS);

    return () => {
      clearTimeout(unlock);
      clearTimeout(end);
    };
  }, [runKey, category, startedAt, router]);

  // no back during countdown (android hardware back; ios swipe is disabled in the layout)
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const reroll = async () => {
    if (!canReroll || rerolledRef.current || finishedRef.current) return;
    rerolledRef.current = true;
    setRerolled(true);
    setCanReroll(false);
    setPick(pickRandom(optionsRef.current, pickRef.current));
    setRunKey((k) => k + 1);
    incrementRerollCount().catch(() => {});
  };

  // shake to reroll, only while reroll is available
  useEffect(() => {
    if (!canReroll) return;
    let armed = true;
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const g = Math.sqrt(x * x + y * y + z * z);
      if (armed && g > SHAKE_THRESHOLD_G) {
        armed = false;
        reroll();
      }
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canReroll]);

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.label}>THIS ONE.</Text>
        <Text style={styles.pick}>{pick}</Text>
        <View style={styles.ring}>
          <CountdownRing durationMs={COUNTDOWN_MS} runKey={runKey} />
        </View>
        <Text style={styles.go}>go. don't reconsider.</Text>
      </View>

      <View style={styles.bottom}>
        {rerolled ? (
          <Text style={styles.shame}>rerolled. that's the overthinking talking.</Text>
        ) : canReroll ? (
          <Pressable onPress={reroll} hitSlop={16} accessibilityRole="button" style={styles.reroll}>
            <Text style={styles.rerollLabel}>reroll</Text>
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  label: {
    color: colors.dim,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2,
  },
  pick: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  ring: {
    marginTop: 16,
  },
  go: {
    color: colors.dim,
    fontSize: 15,
  },
  bottom: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  rerollLabel: {
    color: colors.dim,
    fontSize: 15,
  },
  shame: {
    color: colors.accent,
    fontSize: 15,
    textAlign: 'center',
  },
});
