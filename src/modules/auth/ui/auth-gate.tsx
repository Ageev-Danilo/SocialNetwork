import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../context';
import { useMeQuery } from '../api';

export function AuthGate() {
    const { token, setToken, setUser } = useUserContext();
    const { data: meData } = useMeQuery(undefined, { skip: !token });
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        async function loadToken() {
            const saved = await AsyncStorage.getItem('token');
            if (saved) setToken(saved);
        }
        loadToken();
    }, []);

    useEffect(() => {
        if (meData) setUser(meData);
    }, [meData]);

    useEffect(() => {
        const inAuth = segments[0] === '(auth)';
        if (!token && !inAuth) {
            router.replace('/(auth)/login');
        } else if (token && inAuth) {
            router.replace('/');
        }
    }, [token, segments]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
        </Stack>
    );
}