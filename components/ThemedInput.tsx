import { TextInput, type TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedInput({ style, lightColor, darkColor, ...rest }: ThemedInputProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inputBackground');
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TextInput
      style={[styles.input, { backgroundColor, color: textColor }, style]}
      placeholderTextColor="#999"
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
    fontSize: 16,
    minHeight: 48,
  },
});
