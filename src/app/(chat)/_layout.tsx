import { useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClientSocket } from '@/shared/api';
import { markUnread, markRead } from '@/modules/chat/model/unread.store';
import { setLastMessage } from '@/modules/chat/model/lastMessages.store';


const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

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
    const myUserIdRef      = useRef<string | null>(null);
    const activeChatIdRef  = useRef<string | null>(null);

    useEffect(() => {
        async function connectSocket() {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const payload = decodeJwtPayload(token);
            const userId  = payload.userId ?? payload.sub ?? payload.id ?? payload.user_id;
            if (userId != null) {
                const userIdStr = String(userId);
                await AsyncStorage.setItem('userId', userIdStr);
                myUserIdRef.current = userIdStr;
            }

            if (ClientSocket.connected) return;
            ClientSocket.auth = { token: `Bearer ${token}` };
            ClientSocket.connect();
        }

        function onNewMessage(data: { userId: string; chatId?: string; message: string }) {
            if (myUserIdRef.current != null && data.userId === myUserIdRef.current) return;
            if (data.chatId == null) return;

            const chatId = Number(data.chatId);
            const time   = new Date().toLocaleTimeString('uk-UA', TIME_OPTIONS);

            setLastMessage(chatId, data.message, time);

            if (activeChatIdRef.current === data.chatId) {
                markRead(chatId);
            } else {
                markUnread(chatId);
            }
        }

        function onConnection()  { console.log('Socket connected'); }
        function onDisconnection() { console.log('Socket disconnected'); }
        function onConnectionError(error: Error) { console.error('Socket connection error:', error); }

        connectSocket();
        ClientSocket.on('chat:new-message', onNewMessage);
        ClientSocket.on('connect', onConnection);
        ClientSocket.on('disconnect', onDisconnection);
        ClientSocket.on('connect_error', onConnectionError);

        return () => {
            ClientSocket.off('chat:new-message', onNewMessage);
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