import { useEffect } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClientSocket } from '@/shared/api';


function decodeJwtPayload(token: string): Record<string, unknown> {
    try {
        const base64Url = token.split('.')[1];
        const base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded    = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        const decoded   = decodeURIComponent(
            atob(padded)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join(''),
        );
        return JSON.parse(decoded);
    } catch {
        return {};
    }
}

export default function ChatLayout() {
    useEffect(() => {
        async function connectSocket() {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const payload = decodeJwtPayload(token);
            console.log('[JWT payload]', JSON.stringify(payload));

            const userId = payload.userId ?? payload.sub ?? payload.id ?? payload.user_id;
            if (userId != null) {
                await AsyncStorage.setItem('userId', String(userId));
                console.log('[userId stored]', userId);
            }

            if (ClientSocket.connected) return;
            ClientSocket.auth = { token: `Bearer ${token}` };
            ClientSocket.connect();
        }

        function onConnection() { console.log('Socket connected'); }
        function onDisconnection() { console.log('Socket disconnected'); }
        function onConnectionError(error: Error) { console.error('Socket connection error:', error); }

        connectSocket();
        ClientSocket.on('connect', onConnection);
        ClientSocket.on('disconnect', onDisconnection);
        ClientSocket.on('connect_error', onConnectionError);

        return () => {
            ClientSocket.off('connect', onConnection);
            ClientSocket.off('disconnect', onDisconnection);
            ClientSocket.off('connect_error', onConnectionError);
        };
    }, []);

    const screenOptions = { headerShown: false, animation: 'none' as const };

    return (
        <Stack screenOptions={screenOptions}>
            <Stack.Screen name="chat" />
            <Stack.Screen name="conversation/[id]" />
            <Stack.Screen name="group/[id]" />
        </Stack>
    );
}