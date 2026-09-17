import { Alert, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../src/components/Screen';
import { BackChevron } from '../src/components/BackChevron';
import { Button } from '../src/components/Button';
import { colors } from '../src/theme';

// placeholder: revenuecat wired in phase 3
export default function UnlockScreen() {
  return (
    <Screen>
      <BackChevron label="menu" />
      <View style={styles.center}>
        <Text style={styles.lock}>🔒</Text>
        <Text style={styles.title}>unlock trivial</Text>
        <Text style={styles.sub}>custom lists · saved options</Text>
      </View>
      <View style={styles.bottom}>
        <Button label="$2.99 · unlock forever" onPress={() => Alert.alert('coming soon.')} />
        <Text style={styles.note}>one-time purchase. no subscription.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  lock: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '500',
  },
  sub: {
    color: colors.dim,
    fontSize: 13,
  },
  bottom: {
    gap: 14,
    paddingBottom: 8,
    alignItems: 'center',
  },
  note: {
    color: colors.dim,
    fontSize: 13,
  },
});
