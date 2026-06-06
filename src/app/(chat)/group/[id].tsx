import { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { ClientSocket } from '@/shared/api';
import { ChatThreadScreen } from '@/modules/chat';
import {
    useGetChatMessagesQuery,
    useAddMessageMutation,
    useUploadChatImageMutation,
} from '@/modules/chat/api';
import { messageDtoToThreadItem, buildIncomingItem, buildThreadItemsWithDates } from '@/modules/chat/model/utils';
import { setLastMessage } from '@/modules/chat/model/lastMessages.store';
import { markRead } from '@/modules/chat/model/unread.store';
import { setActiveChatId } from '@/modules/chat/model/activeChat.store';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import type { ThreadItem } from '@/modules/chat';
import type { NewMessageData } from '@/shared/api/socket/socket.contracts';


const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

export default function GroupChatScreen() {
    const { id, title } = useLocalSearchParams<{ id: string; title: string }>();

    const chatId = Number(id);

    const [myUserId, setMyUserId] = useState<number | null>(null);
    const [extraItems, setExtraItems] = useState<ThreadItem[]>([]);
    const myUserIdRef = useRef<string | null>(null);

    const { data: messages = [], isLoading } = useGetChatMessagesQuery(chatId, {
        skip: !chatId || isNaN(chatId),
        refetchOnMountOrArgChange: true,
    });
    const [addMessage] = useAddMessageMutation();
    const [uploadChatImage] = useUploadChatImageMutation();

    useEffect(() => {
        setActiveChatId(chatId);
        markRead(chatId);

        async function loadUserId() {
            const raw = await AsyncStorage.getItem('userId');
            if (raw && raw !== 'undefined') {
                setMyUserId(Number(raw));
                myUserIdRef.current = raw;
            }
        }
        loadUserId();
        setExtraItems([]);

        return () => { setActiveChatId(null); };
    }, [id]);

    useEffect(() => {
        ClientSocket.emit('chat:join', id, (response) => {
            if (response.joined) console.log('Joined group chat:', id);
        });

        function onNewMessage(data: NewMessageData) {
            if (Number(data.chatId) !== chatId) return;
            if (myUserIdRef.current != null && data.userId === myUserIdRef.current) return;
            setExtraItems(prev => [...prev, buildIncomingItem(data.message)]);
        }

        ClientSocket.on('chat:new-message', onNewMessage);

        return () => {
            ClientSocket.emit('chat:leave', id, (response) => {
                if (response.left) console.log('Left group chat:', id);
            });
            ClientSocket.off('chat:new-message', onNewMessage);
        };
    }, [id]);

    async function sendText(text: string) {
        const tempId = `optimistic-${Date.now()}`;
        const time = new Date().toLocaleTimeString('uk-UA', TIME_OPTIONS);
        const optimistic: ThreadItem = {
            type: 'message',
            id: tempId,
            data: { id: tempId, text, time, isMine: true, status: 'sent' },
        };

        setExtraItems(prev => [...prev, optimistic]);
        setLastMessage(chatId, text, time);
        ClientSocket.emit('chat:message', { chatId: id, message: text }, () => {});

        try {
            await addMessage({ chatId, payload: { text } }).unwrap();
        } catch (e) {
            console.warn('addMessage error:', e);
            setExtraItems(prev => prev.filter(item => item.id !== tempId));
        }
    }

    async function handleAttachPress() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (result.canceled) return;

        const { uri } = result.assets[0];
        const tempId = `img-optimistic-${Date.now()}`;
        const time = new Date().toLocaleTimeString('uk-UA', TIME_OPTIONS);
        const placeholder: ThreadItem = {
            type: 'message',
            id:   tempId,
            data: { id: tempId, text: uri, time, isMine: true, status: 'sent' },
        };
        setExtraItems(prev => [...prev, placeholder]);

        try {
            const { path } = await uploadChatImage({ uri }).unwrap();
            await addMessage({ chatId, payload: { text: path } }).unwrap();
            ClientSocket.emit('chat:message', { chatId: id, message: path }, () => {});
            setLastMessage(chatId, '📷 Фото', time);
            setExtraItems(prev => prev.map(item =>
                item.id === tempId && item.type === 'message'
                    ? { ...item, data: { ...item.data, text: path } }
                    : item,
            ));
        } catch (e) {
            console.warn('uploadChatImage error:', e);
            setExtraItems(prev => prev.filter(item => item.id !== tempId));
        }
    }

    if (isLoading || myUserId === null) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={CHAT_COLORS.primary} />
            </View>
        );
    }

    const historyItems = buildThreadItemsWithDates(messages, myUserId);
    const allItems = [...historyItems, ...extraItems];

    const groupInitials = (title ?? 'G').slice(0, 2).toUpperCase();

    return (
        <ChatThreadScreen
            title={title ?? 'Група'}
            subtitle="0 учасників, 0 в мережі"   
            initials={groupInitials}
            items={allItems}
            onSendMessage={sendText}
            onAttachPress={handleAttachPress}
            activeTab="groups"
            onTabChange={() => router.back()}
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