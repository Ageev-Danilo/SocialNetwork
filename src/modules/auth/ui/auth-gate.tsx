import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useUserContext } from '../context';
import { useMeQuery } from '../api';
import { baseApi } from '@/shared/api/base';
import type { AppDispatch } from '@/shared/store';

export function AuthGate() {
    const { token, setToken, setUser } = useUserContext();
    const [initialized, setInitialized] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        async function bootstrap() {
            const savedToken = await AsyncStorage.getItem('token');

            if (savedToken) {
                setToken(savedToken);
            }

            setInitialized(true);
        }

        bootstrap();
    }, []);

    const { data: meData } = useMeQuery(undefined, {
        skip: !initialized || !token,
    });

    useEffect(() => {
        if (meData) {
            setUser(meData);
        }
    }, [meData]);

    useEffect(() => {
        if (!initialized) return;

        const inAuth = segments[0] === '(auth)';
        const inModal = segments[0] === '(modal)';

        if (!token && !inAuth && !inModal) {
            router.replace('/(auth)/login');
            return;
        }

        if (token && inAuth) {
            router.replace('/home');
            router.push('/(modal)/about');
        }
    }, [initialized, token, segments]);

    if (!initialized) {
        return null;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="home" />
            <Stack.Screen name="(chat)" />
            <Stack.Screen name="(friends)" />
            <Stack.Screen name="(posts)" />
            <Stack.Screen name="(modal)" />
            <Stack.Screen name="(settings)" />
        </Stack>
    );
}