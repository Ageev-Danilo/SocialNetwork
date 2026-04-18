import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useUserContext } from '../context';
import { useMeQuery } from '../api';

export function AuthGate() {
    const { token, setToken, setUser } = useUserContext();
    const [isReady, setIsReady] = useState(false);

    const { data: meData } = useMeQuery(undefined, { skip: !token });
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        async function bootstrap() {
            const saved = await SecureStore.getItemAsync('token');
            if (saved) setToken(saved);
            setIsReady(true); 
        }
        bootstrap();
    }, []);

    useEffect(() => {
        if (meData) setUser(meData);
    }, [meData]);

    useEffect(() => {
        if (!isReady) return;

        const inAuth = segments[0] === '(auth)';

        if (!token && !inAuth) {
            router.replace('/(auth)/login');
        } else if (token && inAuth) {
            router.replace('/home');
        }
    }, [isReady, token, segments]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="home" />
            <Stack.Screen name="(chat)" />
            <Stack.Screen name="(friends)" />
            <Stack.Screen name="(posts)" />
        </Stack>
    );
}