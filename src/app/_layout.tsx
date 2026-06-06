import { useEffect, useRef } from 'react';
import { useSegments, useRootNavigation } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, Bottom } from '@/components';
import { store } from '@/shared/store';
import { UserContextProvider } from '@/modules/auth';
import { AuthGate } from '@/modules/auth/ui/auth-gate';
import { ClientSocket } from '@/shared/api';
import { markUnread, markRead } from '@/modules/chat/model/unread.store';
import { setLastMessage } from '@/modules/chat/model/lastMessages.store';
import { getActiveChatId } from '@/modules/chat/model/activeChat.store';
import type { NewMessageData } from '@/shared/api/socket/socket.contracts';
import { initLastMessages } from '@/modules/chat/model/lastMessages.store';


const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

function decodeJwtPayload(token: string): Record<string, unknown> {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
        const decoded = decodeURIComponent(
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

function AppContent() {
    const segments = useSegments();
    const inAuth = segments[0] === '(auth)';
    const myUserIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (inAuth) {
            ClientSocket.disconnect();
            return;
        }

        async function init() {
            await initLastMessages();
            const token = await AsyncStorage.getItem('token');
            
            if (!token) return;

            const payload = decodeJwtPayload(token);
            const userId = payload.userId ?? payload.sub ?? payload.id ?? payload.user_id;
            if (userId != null) {
                const userIdStr = String(userId);
                myUserIdRef.current = userIdStr;
                await AsyncStorage.setItem('userId', userIdStr);
            }

            if (ClientSocket.connected) {
                if (myUserIdRef.current) {
                    ClientSocket.emit('user:online', myUserIdRef.current);
                }
                return;
            }

            ClientSocket.auth = { token: `Bearer ${token}` };
            ClientSocket.connect();
        }

        function onConnection() {
            console.log('Socket connected');
            if (myUserIdRef.current) {
                ClientSocket.emit('user:online', myUserIdRef.current);
            }
        }

        function onNewMessage(data: NewMessageData) {
            console.log('[onNewMessage]', JSON.stringify(data));
            if (!data.chatId) return;
            if (myUserIdRef.current != null && data.userId === myUserIdRef.current) return;

            const chatId = Number(data.chatId);
            const time = new Date().toLocaleTimeString('uk-UA', TIME_OPTIONS);

            setLastMessage(chatId, data.message, time);

            if (getActiveChatId() === chatId) {
                markRead(chatId);
            } else {
                markUnread(chatId);
            }
        }

        function onDisconnect() { console.log('Socket disconnected'); }
        function onConnectError(error: Error) { console.error('Socket error:', error); }

        init();
        ClientSocket.on('connect', onConnection);
        ClientSocket.on('chat:new-message', onNewMessage);
        ClientSocket.on('disconnect', onDisconnect);
        ClientSocket.on('connect_error', onConnectError);

        return () => {
            ClientSocket.off('connect', onConnection);
            ClientSocket.off('chat:new-message', onNewMessage);
            ClientSocket.off('disconnect', onDisconnect);
            ClientSocket.off('connect_error', onConnectError);
        };
    }, [inAuth]);

    return (
        <View style={{ flex: 1, backgroundColor: inAuth ? '#F3F4F6' : '#f7f4ff' }}>
            {!inAuth && <Header />}
            <View style={{ flex: 1 }}>
                <AuthGate />
            </View>
            {!inAuth && <Bottom />}
        </View>
    );
}

export default function RootLayout() {
    const rootNavigation = useRootNavigation();

    if (!rootNavigation?.isReady) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <UserContextProvider>
                    <StatusBar style="auto" />
                    <AppContent />
                </UserContextProvider>
            </Provider>
        </SafeAreaProvider>
    );
}