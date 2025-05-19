import { ThemedText } from './ThemedText';

export function ThemedButtonText({ children }: { children: React.ReactNode }) {
  return (
    <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: 'blue' }}>
      {children}
    </ThemedText>
  );
}
