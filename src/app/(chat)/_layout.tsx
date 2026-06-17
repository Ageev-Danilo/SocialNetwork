import { Stack } from 'expo-router';


export default function ChatLayout() {
    const screenOptions = { headerShown: false, animation: 'none' as const };

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="chat" />
            <Stack.Screen name="conversation/[id]" />
            <Stack.Screen name="group/[id]" />
        </Stack>
    );
}