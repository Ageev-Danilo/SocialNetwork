import { useEffect, useRef, useState, useMemo } from 'react';
import { View, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { ClientSocket } from '@/shared/api';
import { ChatThreadScreen } from '@/modules/chat';
import type { MenuAction } from '@/modules/chat/ui/ChatThreadScreen';
import {
    useGetChatMessagesQuery,
    useAddMessageMutation,
    useGetChatsQuery,
    useDeleteChatMutation,
    useUpdateChatMutation,
} from '@/modules/chat/api';
import { buildThreadItemsWithDates, buildIncomingItem } from '@/modules/chat/model/utils';
import { setLastMessage } from '@/modules/chat/model/lastMessages.store';
import { markRead } from '@/modules/chat/model/unread.store';
import { setActiveChatId } from '@/modules/chat/model/activeChat.store';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import { MediaIcon, PencilIcon, TrashIcon, LeaveIcon } from '@/modules/chat/ui/ChatIcons';
import { EditGroupModal } from '@/modules/chat/ui/EditGroupModal';
import type { ThreadItem } from '@/modules/chat';
import type { NewMessageData } from '@/shared/api/socket/socket.contracts';


const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
const BASE_IP = '10.0.2.2';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${BASE_IP}:3000`;

function buildAvatarUri(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('file')) return path;
    if (path.startsWith('/media')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/media/thumbnail/${path}`;
}

export default function ConversationScreen() {
    const { id, avatarUri } = useLocalSearchParams<{ id: string; avatarUri: string }>();
    const chatId = Number(id);

    const [myUserId, setMyUserId] = useState<number | null>(null);
    const [extraItems, setExtraItems] = useState<ThreadItem[]>([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const myUserIdRef = useRef<string | null>(null);

    const { data: chats = [] } = useGetChatsQuery();
    const { data: messages = [], isLoading } = useGetChatMessagesQuery(chatId, {
        skip: !chatId || isNaN(chatId),
        refetchOnMountOrArgChange: true,
    });
    const [addMessage] = useAddMessageMutation();
    const [deleteChat] = useDeleteChatMutation();
    const [updateChat] = useUpdateChatMutation();

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
            if (response.joined) console.log('Joined chat:', id);
        });
        function onNewMessage(data: NewMessageData) {
            if (Number(data.chatId) !== chatId) return;
            if (myUserIdRef.current != null && data.userId === myUserIdRef.current) return;
            const senderName = data.sender
                ? ([data.sender.firstName, data.sender.lastName].filter(Boolean).join(' ')
                    || data.sender.username || data.sender.email)
                : undefined;
            setExtraItems(prev => [...prev, buildIncomingItem(data.message, senderName)]);
        }
        ClientSocket.on('chat:new-message', onNewMessage);
        return () => {
            ClientSocket.emit('chat:leave', id, (response) => {
                if (response.left) console.log('Left chat:', id);
            });
            ClientSocket.off('chat:new-message', onNewMessage);
        };
    }, [id]);

    const chat = chats.find(c => c.id === chatId);

    const chatTitle = (() => {
        if (myUserId == null || !chat) return `Чат #${id}`;
        if (chat.isGroup) return chat.name ?? 'Група';
        const other = chat.users.find(u => u.id !== myUserId);
        const fullName = [other?.firstName, other?.lastName].filter(Boolean).join(' ');
        if (fullName.trim()) return fullName;
        if (other?.username) {
            const clean = other.username.includes('@')
                ? other.username.split('@')[0]
                : other.username;
            return clean || 'Користувач';
        }
        return 'Користувач';
    })();

    const chatAvatarUri = (() => {
        if (myUserId == null || !chat) return avatarUri || undefined;
        if (chat.isGroup) return chat.avatar ? buildAvatarUri(chat.avatar) : undefined;
        const other = chat.users.find(u => u.id !== myUserId);
        return buildAvatarUri(other?.profileImage) || avatarUri || undefined;
    })();

    const chatSubtitle = (() => {
        if (!chat?.isGroup) return undefined;
        const count = chat.users?.length ?? 0;
        return count > 0 ? `${count} учасників` : undefined;
    })();

    const isGroupAdmin = chat?.isGroup ? chat.adminId === myUserId : false;

    async function handleDeleteChat() {
        try {
            await deleteChat(chatId).unwrap();
            router.back();
        } catch (e) {
            Alert.alert('Помилка', 'Не вдалося видалити чат');
        }
    }

    async function handleLeaveGroup() {
        if (!chat || myUserId == null) return;
        try {
            const memberIds = chat.users.map(u => u.id).filter(id => id !== myUserId);
            await updateChat({ chatId, payload: { memberIds } }).unwrap();
            router.back();
        } catch (e) {
            Alert.alert('Помилка', 'Не вдалося покинути групу');
        }
    }

    const menuActions = useMemo((): MenuAction[] | undefined => {
        if (!chat?.isGroup) return undefined;
        const media: MenuAction = {
            label: 'Медіа',
            icon: <MediaIcon size={20} />,
            onPress: () => Alert.alert('Медіа', 'скоро'),
        };
        if (isGroupAdmin) {
            return [
                media,
                {
                    label: 'Редагувати групу',
                    icon: <PencilIcon size={20} />,
                    onPress: () => setEditModalVisible(true),
                },
                {
                    label: 'Видалити чат',
                    icon: <TrashIcon size={20} />,
                    onPress: () => Alert.alert('Видалити чат', 'Ви дійсно хочете видалити цей чат?', [
                        { text: 'Скасувати', style: 'cancel' },
                        { text: 'Видалити', style: 'destructive', onPress: handleDeleteChat },
                    ]),
                    danger: true,
                },
            ];
        }
        return [
            media,
            {
                label: 'Покинути групу',
                icon: <LeaveIcon size={20} />,
                onPress: () => Alert.alert('Покинути групу', 'Ви дійсно хочете покинути цю групу?', [
                    { text: 'Скасувати', style: 'cancel' },
                    { text: 'Покинути', style: 'destructive', onPress: handleLeaveGroup },
                ]),
                danger: true,
            },
        ];
    }, [chat, isGroupAdmin, myUserId]);

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
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
        if (result.canceled) return;
        const { uri } = result.assets[0];
        const tempId = `img-optimistic-${Date.now()}`;
        const time = new Date().toLocaleTimeString('uk-UA', TIME_OPTIONS);
        const placeholder: ThreadItem = {
            type: 'message',
            id: tempId,
            data: { id: tempId, text: uri, time, isMine: true, status: 'sent' },
        };
        setExtraItems(prev => [...prev, placeholder]);
        setLastMessage(chatId, '📷 Фото', time);
        try {
            await addMessage({ chatId, payload: { text: uri } }).unwrap();
            ClientSocket.emit('chat:message', { chatId: id, message: uri }, () => {});
        } catch (e) {
            console.warn('handleAttachPress error:', e);
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
    const isGroup = chat?.isGroup ?? false;
    const activeTab = isGroup ? 'groups' : 'messages';

    return (
        <>
            <ChatThreadScreen
                title={chatTitle}
                subtitle={chatSubtitle}
                avatarUri={chatAvatarUri}
                items={allItems}
                onSendMessage={sendText}
                onAttachPress={handleAttachPress}
                activeTab={activeTab}
                onTabChange={() => router.back()}
                menuActions={menuActions}
            />
            {chat?.isGroup && (
                <EditGroupModal
                    visible={editModalVisible}
                    onClose={() => setEditModalVisible(false)}
                    chatId={chatId}
                />
            )}
        </>
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