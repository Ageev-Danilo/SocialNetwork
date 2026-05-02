import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="id" />
            <Stack.Screen
                name="modal/create"
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="modal/edit"
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name="modal/delete"
                options={{ presentation: 'modal' }}
            />
        </Stack>
    );
}
