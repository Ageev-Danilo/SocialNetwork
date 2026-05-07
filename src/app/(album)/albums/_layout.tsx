import { Stack } from 'expo-router';

export default function AlbumsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="create"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
            />
        </Stack>
    );
}