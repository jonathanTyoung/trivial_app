import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="category" />
        <Stack.Screen name="options" />
        <Stack.Screen name="pick" options={{ gestureEnabled: false }} />
        <Stack.Screen name="done" options={{ gestureEnabled: false }} />
        <Stack.Screen name="menu" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="stats" />
        <Stack.Screen name="history" />
        <Stack.Screen name="unlock" />
      </Stack>
    </>
  );
}
