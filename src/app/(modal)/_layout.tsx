import { Stack } from 'expo-router';


export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="about"
                options={{
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}