import { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClientSocket } from '@/shared/api';
import { ChatThreadScreen } from '@/modules/chat';
import { useGetChatMessagesQuery, useAddMessageMutation, useGetChatsQuery } from '@/modules/chat/api';
import { messageDtoToThreadItem, buildIncomingItem } from '@/modules/chat/model/utils';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import type { ThreadItem } from '@/modules/chat';


const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

export default function ConversationScreen() {
    const { id, avatarUri } = useLocalSearchParams<{
        id:        string;
        avatarUri: string;
    }>();

    const chatId = Number(id);

    const [myUserId, setMyUserId]     = useState<number | null>(null);
    const [extraItems, setExtraItems] = useState<ThreadItem[]>([]);
    const pendingSent                 = useRef<Set<string>>(new Set());

    const { data: chats = [] }       = useGetChatsQuery();
    const { data: messages = [], isLoading } = useGetChatMessagesQuery(chatId, {
        skip:                      !chatId || isNaN(chatId),
        refetchOnMountOrArgChange: true,
    });
    const [addMessage] = useAddMessageMutation();

    useEffect(() => {
        async function loadUserId() {
            const raw = await AsyncStorage.getItem('userId');
            if (raw && raw !== 'undefined') setMyUserId(Number(raw));
        }
        loadUserId();
        setExtraItems([]);
    }, [id]);

    useEffect(() => {
        ClientSocket.emit('chat:join', id, (response) => {
            if (response.joined) console.log('Joined chat:', id);
        });

        function onNewMessage(data: { userId: string; message: string }) {
            const key = `${data.userId}:${data.message}`;
            if (pendingSent.current.has(key)) {
                pendingSent.current.delete(key);
                return;
            }
            setExtraItems(prev => [...prev, buildIncomingItem(data.message)]);
        }

        ClientSocket.on('chat:new-message', onNewMessage);

        return () => {
            ClientSocket.emit('chat:leave', id, (response) => {
                if (response.left) console.log('Left chat:', id);
            });
            ClientSocket.off('chat:new-message', onNewMessage);
        };
    }, [id]);

    async function handleSendMessage(text: string) {
        const tempId = `optimistic-${Date.now()}`;
        const time   = new Date().toLocaleTimeString('uk-UA', TIME_OPTIONS);
        const optimistic: ThreadItem = {
            type: 'message',
            id:   tempId,
            data: { id: tempId, text, time, isMine: true, status: 'sent' },
        };

        const myId = await AsyncStorage.getItem('userId');
        const key  = `${myId}:${text}`;
        pendingSent.current.add(key);
        setExtraItems(prev => [...prev, optimistic]);

        ClientSocket.emit('chat:message', { chatId: id, message: text }, () => {});

        try {
            await addMessage({ chatId, payload: { text } }).unwrap();
        } catch (e) {
            console.warn('addMessage error:', e);
            pendingSent.current.delete(key);
            setExtraItems(prev => prev.filter(item => item.id !== tempId));
        }
    }

    const chatTitle = (() => {
        if (myUserId == null || chats.length === 0) return `Чат #${id}`;
        const chat = chats.find(c => c.id === chatId);
        if (!chat) return `Чат #${id}`;
        const other = chat.users.find(u => u.id !== myUserId);
        return other?.username ?? other?.email ?? `Чат #${id}`;
    })();

    if (isLoading || myUserId === null) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={CHAT_COLORS.primary} />
            </View>
        );
    }

    const historyItems: ThreadItem[] = messages.map(m => messageDtoToThreadItem(m, myUserId));
    const allItems = [...historyItems, ...extraItems];

    return (
        <ChatThreadScreen
            title={chatTitle}
            avatarUri={avatarUri || undefined}
            items={allItems}
            onSendMessage={handleSendMessage}
        />
    );
}

const styles = StyleSheet.create({
    center: {
        flex:            1,
        justifyContent:  'center',
        alignItems:      'center',
        backgroundColor: CHAT_COLORS.screenBg,
    },
});