import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  /** Total duration in ms. */
  durationMs: number;
  /** Change this value to restart the animation from full. */
  runKey: number;
  size?: number;
  strokeWidth?: number;
};

export function CountdownRing({ durationMs, runKey, size = 120, strokeWidth = 3 }: Props) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = 1;
    progress.value = withTiming(0, { duration: durationMs, easing: Easing.linear });
  }, [durationMs, runKey, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.text}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

