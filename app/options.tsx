import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { SUGGESTIONS } from '../src/lib/suggestions';
import type { Category } from '../src/lib/types';
import { colors, radius } from '../src/theme';

const MAX_OPTIONS = 6;

export default function OptionsScreen() {
  const router = useRouter();
  const { category = 'anything', startedAt } = useLocalSearchParams<{
    category?: Category;
    startedAt?: string;
  }>();
  const [options, setOptions] = useState<string[]>(['', '']);

  const filled = options.map((o) => o.trim()).filter(Boolean);
  const canPick = filled.length >= 2;
  const allEmpty = filled.length === 0;

  const update = (i: number, value: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));

  const remove = (i: number) =>
    setOptions((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));

  const add = () => setOptions((prev) => (prev.length >= MAX_OPTIONS ? prev : [...prev, '']));

  const goPick = (opts: string[], mode: 'own' | 'suggest') =>
    router.push({
      pathname: '/pick',
      params: {
        category,
        options: JSON.stringify(opts),
        mode,
        startedAt: startedAt ?? String(Date.now()),
      },
    });

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {category} <Text style={styles.dot}>·</Text> your options
          </Text>
          {allEmpty && <Text style={styles.empty}>type them. don't rank them.</Text>}
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        >
          {options.map((value, i) => (
            <View key={i} style={styles.row}>
              <TextInput
                value={value}
                onChangeText={(t) => update(i, t)}
                placeholder={`option ${i + 1}`}
                placeholderTextColor={colors.dim}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType={i === options.length - 1 ? 'done' : 'next'}
                onSubmitEditing={i === options.length - 1 && options.length < MAX_OPTIONS ? add : undefined}
              />
              <Pressable
                onPress={() => remove(i)}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={`remove option ${i + 1}`}
                style={styles.remove}
              >
                <Text style={styles.removeLabel}>×</Text>
              </Pressable>
            </View>
          ))}

          {options.length < MAX_OPTIONS && (
            <Pressable onPress={add} accessibilityRole="button" style={styles.add}>
              <Text style={styles.addLabel}>+ add another</Text>
            </Pressable>
          )}
        </ScrollView>

        <View style={styles.bottom}>
          <Button label="pick for me." disabled={!canPick} onPress={() => goPick(filled, 'own')} />
          <Button
            label="just pick something →"
            variant="ghost"
            onPress={() => goPick(SUGGESTIONS[category] ?? SUGGESTIONS.anything, 'suggest')}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingTop: 32,
    paddingBottom: 24,
    gap: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '500',
  },
  dot: {
    color: colors.dim,
  },
  empty: {
    color: colors.dim,
    fontSize: 15,
  },
  list: {
    gap: 10,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: 16,
  },
  input: {
    flex: 1,
    height: 52,
    color: colors.text,
    fontSize: 17,
    fontWeight: '400',
  },
  remove: {
    width: 44,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLabel: {
    color: colors.dim,
    fontSize: 22,
    lineHeight: 24,
  },
  add: {
    height: 44,
    justifyContent: 'center',
  },
  addLabel: {
    color: colors.dim,
    fontSize: 15,
  },
  bottom: {
    gap: 8,
    paddingBottom: 8,
  },
});
