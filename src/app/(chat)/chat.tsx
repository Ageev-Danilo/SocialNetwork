import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import {
    ChatListItem,
    ChatSearchBar,
    ChatSectionHeader,
    ChatTabs,
    ContactListItem,
    MessagesTabIcon,
} from '@/modules/chat';
import type { ChatTabId } from '@/modules/chat';
import { useCreateChatMutation, useGetChatsQuery } from '@/modules/chat/api';
import type { ChatDto } from '@/modules/chat/api';
import { initLastMessages, useLastMessages } from '@/modules/chat/model/lastMessages.store';
import { useUnreadFlags } from '@/modules/chat/model/unread.store';
import { setActiveChatId, useActiveChatId } from '@/modules/chat/model/activeChat.store';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import type { ContactItemData } from '@/modules/chat/ui/ContactListItem';
import { useGetFriendsQuery } from '@/modules/friends';
import { Icon } from '@/shared/ui';


const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.0.152:3000';

function buildAvatarUri(path: string | null | undefined): string {
    if (!path) {
        return '';
    }
    if (path.startsWith('http') || path.startsWith('file')) {
        return path;
    }
    if (path.startsWith('/media')) {
        return `${BASE_URL}${path}`;
    }
    return `${BASE_URL}/media/thumbnail/${path}`;
}

export default function ChatScreen() {
    const [activeTab, setActiveTab] = useState<ChatTabId>('contacts');
    const [searchQuery, setSearchQuery] = useState('');
    const [myUserId, setMyUserId] = useState<number | null>(null);

    const { data: contacts = [], isLoading: isContactsLoading } = useGetFriendsQuery();
    const { data: chats = [], isLoading: isChatsLoading } = useGetChatsQuery();
    const { data: friends = [], isLoading: isFriendsLoading } = useGetFriendsQuery();
    const [createChat] = useCreateChatMutation();
    const lastMessages = useLastMessages();
    const unreadFlags = useUnreadFlags();
    const activeChatId = useActiveChatId();

    useEffect(() => {
        async function init() {
            await initLastMessages();
            const raw = await AsyncStorage.getItem('userId');
            if (raw && raw !== 'undefined') {
                setMyUserId(Number(raw));
            }
        }
        init();
    }, []);

    const q = searchQuery.trim().toLowerCase();

    function getChatTitle(chat: ChatDto, userId: number): string {
        if (chat.isGroup) {
            return chat.name ?? 'Група';
        }
        const other = chat.users.find(u => u.id !== userId);
        if (!other) {
            return 'Чат';
        } 
        const pseudonym = (other as any).pseudonym || (other as any).profile?.pseudonym;
        if (pseudonym) {
            return pseudonym;
        } 
        const fullName = [other.firstName, other.lastName].filter(Boolean).join(' ');
        if (fullName.trim()) {
            return fullName;
        } 
        if (other.username) {
            if (other.username.includes('@')) {
                return other.username.split('@')[0];  
            }
            return `@${other.username}`;
        } 
        return 'Користувач';
    }

    function getChatAvatar(chat: ChatDto, userId: number): string | undefined {
        if (chat.isGroup) {
            return chat.avatar ? buildAvatarUri(chat.avatar) : undefined;
        }
        const other = chat.users.find(u => u.id !== userId);
        return other?.profileImage ? buildAvatarUri(other.profileImage) : undefined;
    }

    function getChatLastMessage(chat: ChatDto): string {
        return lastMessages.get(chat.id)?.text ?? '';
    }

    function getChatLastTime(chat: ChatDto): string {
        return lastMessages.get(chat.id)?.time ?? '';
    }

    const contactItems = useMemo((): ContactItemData[] => {
        const mapped = friends.map(f => ({
            id: f.contactProfile.id,
            userId: f.contactProfile.userId ?? undefined,
            name: f.contactProfile.pseudonym,
            username: f.contactProfile.username,
            avatarUri: buildAvatarUri(f.contactProfile.profileImage),
        }));
        if (!q) {
            return mapped;
        }
        return mapped.filter(c =>
            c.name.toLowerCase().includes(q) || (c.username ?? '').toLowerCase().includes(q)
        );
    }, [friends, q]);

    const filteredChats = useMemo(() => {
        if (!q || myUserId === null) {
            return chats;
        }
        return chats.filter(c => getChatTitle(c, myUserId).toLowerCase().includes(q));
    }, [q, chats, myUserId]);

    function handleTabChange(id: ChatTabId) {
        setActiveTab(id);
        setSearchQuery('');
    }

    function openConversation(id: number, title?: string, avatarUri?: string) {
        setActiveChatId(id);
        router.push({
            pathname: `/(chat)/conversation/${id}` as any,
            params: { title: title ?? 'Чат', avatarUri: avatarUri ?? '' },
        });
    }

    async function openOrCreateChat(contact: ContactItemData) {
        if (!contact.userId) {
            return;
        }
        const existingChat = chats.find(c =>
            !c.isGroup && c.users.some(u => u.id === contact.userId)
        );
        if (existingChat && myUserId !== null) {
            const title = getChatTitle(existingChat, myUserId);
            const avatar = getChatAvatar(existingChat, myUserId);
            openConversation(existingChat.id, title, avatar);
            return;
        }
        try {
            const newChat = await createChat({ memberIds: [contact.userId] }).unwrap();
            openConversation(newChat.id, contact.name, contact.avatarUri);
        } catch (e) {
            console.warn('createChat error:', e);
        }
    }

    function renderSectionHeader() {
        if (activeTab === 'messages') {
            return (
                <ChatSectionHeader
                    title="Повідомлення"
                    icon={<Icon.chat size={20} />}
                />
            );
        }
        if (activeTab === 'groups') {
            return (
                <ChatSectionHeader
                    title="Групові чати"
                    icon={<Icon.chat size={20} />}
                />
            );
        }
        return (
            <ChatSectionHeader
                title="Контакти"
                icon={<Icon.group size={20} />}
            />
        );
    }

    function renderContent() {
        if (activeTab === 'messages') {
            if (isChatsLoading) {
                return (
                    <View style={styles.loader}>
                        <ActivityIndicator color={CHAT_COLORS.primary} />
                    </View>
                );
            }
            const dmChats = filteredChats.filter(c => !c.isGroup);
            if (dmChats.length === 0) {
                return <Text style={styles.emptyText}>У вас немає жодного чату</Text>;
            }
            return dmChats.map(chat => {
                const chatTitle = myUserId !== null ? getChatTitle(chat, myUserId) : '';
                const chatAvatar = myUserId !== null ? getChatAvatar(chat, myUserId) : undefined;
                const lastMsg = getChatLastMessage(chat);
                const lastTime = getChatLastTime(chat);
                const unread = unreadFlags.get(chat.id) ?? false;
                return (
                    <ChatListItem
                        key={chat.id}
                        title={chatTitle}
                        avatarUri={chatAvatar || undefined}
                        subtitle={lastMsg}
                        time={lastMsg ? lastTime : undefined}
                        hasUnread={unread}
                        highlighted={chat.id === activeChatId}
                        onPress={() => openConversation(chat.id, chatTitle, chatAvatar)}
                    />
                );
            });
        }
        if (activeTab === 'groups') {
            if (isChatsLoading) {
                return (
                    <View style={styles.loader}>
                        <ActivityIndicator color={CHAT_COLORS.primary} />
                    </View>
                );
            }
            const groupChats = filteredChats.filter(c => c.isGroup);
            if (groupChats.length === 0) {
                return <Text style={styles.emptyText}>У вас немає жодної групи</Text>;
            }
            return groupChats.map(chat => {
                const chatTitle = chat.name ?? 'Група';
                const chatAvatar = chat.avatar ? buildAvatarUri(chat.avatar) : undefined;
                const lastMsg = getChatLastMessage(chat);
                const lastTime = getChatLastTime(chat);
                const unread = unreadFlags.get(chat.id) ?? false;
                return (
                    <ChatListItem
                        key={chat.id}
                        title={chatTitle}
                        avatarUri={chatAvatar}
                        subtitle={lastMsg}
                        time={lastMsg ? lastTime : undefined}
                        hasUnread={unread}
                        highlighted={chat.id === activeChatId}
                        isGroup
                        onPress={() => openConversation(chat.id, chatTitle, chatAvatar)}
                    />
                );
            });
        }

        if (isFriendsLoading) {
            return (
                <View style={styles.loader}>
                    <ActivityIndicator color={CHAT_COLORS.primary} />
                </View>
            );
        }
        if (contactItems.length === 0) {
            return <Text style={styles.emptyText}>Список контактів порожній</Text>;
        }
        return contactItems.map(contact => (
            <ContactListItem
                key={contact.id}
                contact={contact}
                onPress={() => openOrCreateChat(contact)}
            />
        ));
    }

    const anyDmUnread = chats.filter(c => !c.isGroup).some(c => unreadFlags.get(c.id));
    const anyGroupUnread = chats.filter(c => c.isGroup).some(c => unreadFlags.get(c.id));
    const messageBadge = anyDmUnread ? 1 : undefined;
    const groupBadge = anyGroupUnread ? 1 : undefined;

    return (
        <View style={styles.screen}>
            <ChatTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                messageBadge={messageBadge}
                groupBadge={groupBadge}
            />
            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.panel}>
                    {renderSectionHeader()}
                    <ChatSearchBar value={searchQuery} onChangeText={setSearchQuery} />
                    <View style={styles.itemsArea}>
                        {renderContent()}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: CHAT_COLORS.screenBg,
    },
    scrollArea: { flex: 1 },
    scrollContent: {
        paddingTop: 6,
        paddingBottom: 24,
    },
    panel: {
        backgroundColor: CHAT_COLORS.cardBg,
        borderRadius: 16,
        overflow: 'hidden',
        paddingBottom: 16,
    },
    loader: {
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        padding: 24,
        textAlign: 'center',
        color: CHAT_COLORS.textMuted,
        fontSize: 15,
    },
    itemsArea: {
        flex: 1,
    },
});
