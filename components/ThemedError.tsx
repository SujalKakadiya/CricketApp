import { View, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

export function ThemedError({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>{children}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 8,
  },
  text: {
    color: 'red',
    fontSize: 14,
  },
});
