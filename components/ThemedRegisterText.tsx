import { Pressable } from 'react-native';
import { ThemedText } from './ThemedText';

export function ThemedRegisterText({ children, onPress }: { children: React.ReactNode, onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
        <ThemedText 
          type="link" 
          style={{ color: '#0a7ea4', fontSize: 16 }}>{children}
        </ThemedText>
    </Pressable>
  );
}
