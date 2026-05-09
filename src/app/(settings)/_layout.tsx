import { Stack } from 'expo-router';

export default function SettingsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="settings/index" /> 
            <Stack.Screen name="settings/albums" />
        </Stack>
    );
}