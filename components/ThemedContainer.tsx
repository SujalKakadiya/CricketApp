import { ThemedText } from './ThemedText';

export function ThemedContainer({ children }: { children: React.ReactNode }) {
  return (
    <ThemedText style={{ fontSize: 15, marginRight: 5 }}>
      {children}
    </ThemedText>
  );
}