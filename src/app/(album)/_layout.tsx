import { Stack } from 'expo-router';

export default function AlbumLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="albums" />
        </Stack>
    );
}