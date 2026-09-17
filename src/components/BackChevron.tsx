import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme';

type Props = { label?: string };

export function BackChevron({ label = 'menu' }: Props) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.back()}
      hitSlop={16}
      accessibilityRole="button"
      accessibilityLabel={`back to ${label}`}
      style={({ pressed }) => [styles.tap, pressed && styles.pressed]}
    >
      <Text style={styles.text}>‹ {label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tap: {
    height: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    color: colors.dim,
    fontSize: 15,
  },
});
