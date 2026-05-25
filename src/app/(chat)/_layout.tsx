import { Stack } from 'expo-router';

export default function ChatLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="chat" />
            <Stack.Screen name="conversation/[id]" />
            <Stack.Screen name="group/[id]" />
        </Stack>
    );
}