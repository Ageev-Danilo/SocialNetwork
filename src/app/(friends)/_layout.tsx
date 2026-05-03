import { Stack } from 'expo-router';


export default function FriendsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="friends" />
        </Stack>
    );
}