import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ChatTabs,
    ChatListItem,
    ContactListItem,
    ChatSectionHeader,
    ChatSearchBar,
    MessagesTabIcon,
} from '@/modules/chat';
import { useGetChatsQuery } from '@/modules/chat/api';
import type { ChatDto } from '@/modules/chat/api';
import type { ChatTabId } from '@/modules/chat';
import { useGetFriendsQuery } from '@/modules/friends';
import { useLastMessages } from '@/modules/chat/model/lastMessages.store';
import { useUnreadFlags, hasAnyUnread } from '@/modules/chat/model/unread.store';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import { ContactsTabIcon, GroupsTabIcon } from '@/modules/chat/ui/ChatIcons';
import type { ContactItemData } from '@/modules/chat/ui/ContactListItem';


const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';
const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

function buildAvatarUri(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('file')) return path;
    if (path.startsWith('/media')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/media/thumbnail/${path}`;
}

export default function ChatScreen() {
    const [activeTab, setActiveTab]     = useState<ChatTabId>('contacts');
    const [searchQuery, setSearchQuery] = useState('');
    const [myUserId, setMyUserId]       = useState<number | null>(null);

    const { data: chats   = [], isLoading: isChatsLoading }   = useGetChatsQuery();
    const { data: friends = [], isLoading: isFriendsLoading } = useGetFriendsQuery();
    const lastMessages = useLastMessages();
    const unreadFlags  = useUnreadFlags();

    useEffect(() => {
        async function loadUserId() {
            const raw = await AsyncStorage.getItem('userId');
            if (raw && raw !== 'undefined') setMyUserId(Number(raw));
        }
        loadUserId();
    }, []);

    const q = searchQuery.trim().toLowerCase();

    function getChatTitle(chat: ChatDto, myUserId: number): string {
        if (chat.isGroup) return chat.name ?? 'Група';
        const other = chat.users.find(u => u.id !== myUserId);
        if (!other) return 'Чат';
        const fullName = [other.firstName, other.lastName].filter(Boolean).join(' ');
        return fullName || other.username || other.email;
    }

    function getChatAvatar(chat: ChatDto, myUserId: number): string | undefined {
        if (chat.isGroup) return chat.avatar ? buildAvatarUri(chat.avatar) : undefined;
        const other = chat.users.find(u => u.id !== myUserId);
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
            id:        f.contactProfile.id,
            name:      f.contactProfile.pseudonym,
            username:  f.contactProfile.username,
            avatarUri: buildAvatarUri(f.contactProfile.profileImage),
        }));
        if (!q) return mapped;
        return mapped.filter(c =>
            c.name.toLowerCase().includes(q) || (c.username ?? '').toLowerCase().includes(q),
        );
    }, [friends, q]);

    const filteredChats = useMemo(() => {
        if (!q || myUserId === null) return chats;
        return chats.filter(c => getChatTitle(c, myUserId).toLowerCase().includes(q));
    }, [q, chats, myUserId]);

    function handleTabChange(id: ChatTabId) {
        setActiveTab(id);
        setSearchQuery('');
    }

    function openConversation(id: string, title?: string, avatarUri?: string) {
        router.push({
            pathname: `/(chat)/conversation/${id}` as any,
            params:   { title: title ?? 'Чат', avatarUri: avatarUri ?? '' },
        });
    }

    function openContactProfile(contact: ContactItemData) {
        router.push({
            pathname: '/(friends)/user-profile' as any,
            params: {
                profileId: String(contact.id),
                name:      contact.name,
                username:  contact.username ?? '',
                avatarUrl: contact.avatarUri ?? '',
                mode:      'friend',
            },
        });
    }

    function renderSectionHeader() {
        switch (activeTab) {
            case 'messages':
                return (
                    <ChatSectionHeader
                        title="Повідомлення"
                        icon={<MessagesTabIcon color={CHAT_COLORS.textMuted} size={20} />}
                    />
                );
            case 'groups':
                return (
                    <ChatSectionHeader
                        title="Групові чати"
                        icon={<GroupsTabIcon color={CHAT_COLORS.textMuted} size={20} />}
                    />
                );
            default:
                return (
                    <ChatSectionHeader
                        title="Контакти"
                        icon={<ContactsTabIcon color={CHAT_COLORS.textMuted} size={20} />}
                    />
                );
        }
    }

    function renderContent() {
        switch (activeTab) {
            case 'messages':
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
                    const chatTitle  = myUserId !== null ? getChatTitle(chat, myUserId) : '';
                    const chatAvatar = myUserId !== null ? getChatAvatar(chat, myUserId) : undefined;
                    const lastMsg    = getChatLastMessage(chat);
                    const lastTime   = getChatLastTime(chat);
                    const unread     = unreadFlags.get(chat.id) ?? false;
                    return (
                        <ChatListItem
                            key={chat.id}
                            title={chatTitle}
                            avatarUri={chatAvatar || undefined}
                            subtitle={lastMsg}
                            time={lastMsg ? lastTime : undefined}
                            hasUnread={unread}
                            onPress={() => openConversation(String(chat.id), chatTitle, chatAvatar)}
                        />
                    );
                });

            case 'groups':
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
                    const chatTitle  = chat.name ?? 'Група';
                    const chatAvatar = chat.avatar ? buildAvatarUri(chat.avatar) : undefined;
                    const lastMsg    = getChatLastMessage(chat);
                    const lastTime   = getChatLastTime(chat);
                    const unread     = unreadFlags.get(chat.id) ?? false;
                    return (
                        <ChatListItem
                            key={chat.id}
                            title={chatTitle}
                            avatarUri={chatAvatar}
                            subtitle={lastMsg}
                            time={lastMsg ? lastTime : undefined}
                            hasUnread={unread}
                            onPress={() => openConversation(String(chat.id), chatTitle, chatAvatar)}
                        />
                    );
                });

            default:
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
                        onPress={() => openContactProfile(contact)}
                    />
                ));
        }
    }

    const anyUnread = [...unreadFlags.values()].some(Boolean);
    const messageBadge = anyUnread ? 1 : undefined;

    return (
        <View style={styles.screen}>
            <ChatTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                messageBadge={messageBadge}
            />
            <View style={styles.panel}>
                {renderSectionHeader()}
                <ChatSearchBar value={searchQuery} onChangeText={setSearchQuery} />
                <ScrollView
                    style={styles.list}
                    showsVerticalScrollIndicator
                    keyboardShouldPersistTaps="handled"
                >
                    {renderContent()}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: CHAT_COLORS.screenBg,
    },
    panel: {
        flex:            1,
        backgroundColor: CHAT_COLORS.cardBg,
    },
    list:      { flex: 1 },
    loader:    { paddingVertical: 40, alignItems: 'center' },
    emptyText: {
        textAlign:         'center',
        color:             CHAT_COLORS.textMuted,
        fontSize:          15,
        paddingVertical:   40,
        paddingHorizontal: 20,
    },
});