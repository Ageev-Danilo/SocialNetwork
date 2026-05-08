import { Stack } from 'expo-router';

export default function AlbumDetailLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="edit"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
        </Stack>
    );
}