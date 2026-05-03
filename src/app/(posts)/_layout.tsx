import { Stack } from 'expo-router';


export default function PostsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="posts" />
        </Stack>
    );
}