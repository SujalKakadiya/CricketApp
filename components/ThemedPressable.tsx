import { Pressable, type PressableProps, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedPressableProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  borderRadius?: number;
  padding?: number;
};

export function ThemedPressable({
  style,
  lightColor,
  darkColor,
  borderRadius = 8,
  padding = 12,
  ...rest
}: ThemedPressableProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'button');

  const combinedStyle: ViewStyle = {
    backgroundColor,
    borderRadius,
    padding,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return <Pressable style={[combinedStyle, style]} {...rest} />;
}
