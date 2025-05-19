import { Pressable, StyleSheet, type PressableProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedButtonProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedButton({ style, lightColor, darkColor, ...rest }: ThemedButtonProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'button');

  return <Pressable style={[styles.button, { backgroundColor }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
  },
});
