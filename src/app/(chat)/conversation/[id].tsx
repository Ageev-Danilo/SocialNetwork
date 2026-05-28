import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClientSocket } from '@/shared/api';
import { ChatThreadScreen } from '@/modules/chat';
import { useGetChatMessagesQuery } from '@/modules/chat/api';
import { messageDtoToThreadItem, buildOptimisticItem, buildIncomingItem } from '@/modules/chat/model/utils';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import type { ThreadItem } from '@/modules/chat';


export default function ConversationScreen() {
    const { id, title, avatarUri } = useLocalSearchParams<{
        id: string;
        title: string;
        avatarUri: string;
    }>();

    const chatId = Number(id);

    const [myProfileId, setMyProfileId] = useState<number | null>(null);
    const [extraItems, setExtraItems] = useState<ThreadItem[]>([]);

    const skipQuery = !chatId || isNaN(chatId);
    const { data: messages = [], isLoading } = useGetChatMessagesQuery(chatId, { skip: skipQuery });

    useEffect(() => {
        async function loadProfileId() {
            const raw = await AsyncStorage.getItem('profileId');
            if (raw) setMyProfileId(Number(raw));
        }
        loadProfileId();
    }, []);

    useEffect(() => {
        ClientSocket.emit('chat:join', id, (response) => {
            if (response.joined) console.log('Joined chat:', id);
        });

        function onNewMessage(data: { userId: string; message: string }) {
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

    function handleSendMessage(text: string) {
        ClientSocket.emit('chat:message', { chatId: id, message: text }, (response) => {
            if (response.delivered) {
                setExtraItems(prev => [...prev, buildOptimisticItem(text)]);
            }
        });
    }

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={CHAT_COLORS.primary} />
            </View>
        );
    }

    const historyItems: ThreadItem[] = myProfileId != null
        ? messages.map(m => messageDtoToThreadItem(m, myProfileId))
        : [];

    const allItems = [...historyItems, ...extraItems];

    return (
        <ChatThreadScreen
            title={title ?? 'Чат'}
            avatarUri={avatarUri}
            items={allItems}
            onSendMessage={handleSendMessage}
        />
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CHAT_COLORS.screenBg,
    },
});