import { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ChatTabs,
    ChatListItem,
    ContactListItem,
    GroupListItem,
    ChatSectionHeader,
    ChatSearchBar,
    MessagesTabIcon,
    MOCK_CONVERSATIONS,
    MOCK_GROUP_CHATS,
    CHAT_TAB_BADGE,
} from '@/modules/chat';
import { useGetChatsQuery } from '@/modules/chat/api';
import type { ChatDto } from '@/modules/chat/api';
import type { ChatTabId } from '@/modules/chat';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import { ContactsTabIcon, GroupsTabIcon } from '@/modules/chat/ui/ChatIcons';
import { Icon } from '@/shared/ui';
import { useGetFriendsQuery } from '@/modules/friends';
import { ChatItem } from '@/modules/chat/ui/ChatItem';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';

export default function ChatScreen() {
    const [activeTab, setActiveTab] = useState<ChatTabId>('contacts');
    const [searchQuery, setSearchQuery] = useState('');
    const [myUserId, setMyUserId] = useState<number | null>(null);

    const { data: contacts = [], isLoading: isContactsLoading } = useGetFriendsQuery();
    const { data: chats = [], isLoading: isChatsLoading } = useGetChatsQuery();
    const { data: groups = [], isLoading: isGroupsLoading } = useGetChatsQuery();

    useEffect(() => {
        async function loadUserId() {
            const raw = await AsyncStorage.getItem('userId');
            if (raw) setMyUserId(Number(raw));
        }
        loadUserId();
    }, []);

    const q = searchQuery.trim().toLowerCase();

    function buildAvatarUri(path: string | null | undefined): string {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('file')) return path;
        if (path.startsWith('/media')) return `${BASE_URL}${path}`;
        return `${BASE_URL}/media/thumbnail/${path}`;
    }

    function getChatTitle(chat: ChatDto, myUserId: number | null): string {
        if (chat.name) return chat.name;
        if (myUserId == null) return `Чат #${chat.id}`;
        const other = chat.users.find(u => u.id !== myUserId);
        return other?.username ?? other?.email ?? `Чат #${chat.id}`;
    }

    function getChatAvatarUri(chat: ChatDto, myUserId: number | null): string {
        if (chat.avatar) return buildAvatarUri(chat.avatar);
        if (myUserId == null) return '';
        const other = chat.users.find(u => u.id !== myUserId);
        return buildAvatarUri(other?.profile?.profileImage);
    }

    // console.log('CONTACTS: ' + JSON.stringify(contacts, null, 2));

    const mappedContacts = useMemo(
        () =>
            contacts.map(contact => ({
                id: String(contact.contactProfile.id),
                name: contact.contactProfile.pseudonym || 'Видалений',
                username: contact.contactProfile.username || 'user',
                avatarUri: buildAvatarUri(contact.contactProfile.profileImage),
                isOnline: false,
            })),
        [contacts],
    );

    const filteredContacts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return mappedContacts;
        return mappedContacts.filter(
            c => c.pseudonym.toLowerCase().includes(q) || c.signature.toLowerCase().includes(q),
        );
    }, [searchQuery, mappedContacts]);

    const filteredChats = useMemo(() => {
        if (!q) return chats;
        return chats.filter(c => getChatTitle(c, myUserId).toLowerCase().includes(q));
    }, [q, chats, myUserId]);

    const filteredGroups = useMemo(() => {
        if (!q) return MOCK_GROUP_CHATS;
        return MOCK_GROUP_CHATS.filter(
            g => g.name.toLowerCase().includes(q) || g.lastMessage.toLowerCase().includes(q),
        );
    }, [q]);

    function handleTabChange(id: ChatTabId) {
        setActiveTab(id);
        setSearchQuery('');
    }

    function openConversation(id: string, title?: string, avatarUri?: string) {
        router.push({
            pathname: `/(chat)/conversation/${id}` as any,
            params: { title: title ?? 'Чат', avatarUri: avatarUri ?? '' },
        });
    }

    function openGroup(id: string) {
        router.push(`/(chat)/group/${id}` as any);
    }

    function renderSectionHeader() {
        switch (activeTab) {
            case 'messages':
                return <ChatSectionHeader title="Повідомлення" icon={<MessagesTabIcon />} />;
            case 'groups':
                return <ChatSectionHeader title="Групові чати" icon={<MessagesTabIcon />} />;
            default:
                return (
                    <ChatSectionHeader
                        title="Контакти"
                        icon={<Icon name="group" size={20} fill="#81818D" />}
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
                if (chats.length > 0) {
                    return filteredChats.map(chat => {
                        const chatTitle = getChatTitle(chat, myUserId);
                        const chatAvatar = getChatAvatarUri(chat, myUserId);
                        return (
                            <ChatListItem
                                key={chat.id}
                                title={chatTitle}
                                avatarUri={chatAvatar}
                                onPress={() =>
                                    openConversation(String(chat.id), chatTitle, chatAvatar)
                                }
                                subtitle={''}
                            />
                        );
                    });
                }
                return (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Немає повідомлень.</Text>
                    </View>
                );

            case 'groups':
                if (groups.length > 0) {
                    return groups.map(group => (
                        <GroupListItem
                            key={group.id}
                            group={group}
                            onPress={() => openGroup(group.id)}
                        />
                    ));
                }
                return (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>Немає групових чатів.</Text>
                    </View>
                );

            default:
                if (filteredContacts.length === 0)
                    return (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>У вас ще немає контактів</Text>
                        </View>
                    );

                return filteredContacts.map(contact => (
                    <ChatItem
                        key={contact.id}
                        data={contact}
                        onPress={() => {
                            const conv = MOCK_CONVERSATIONS.find(c => c.contactId === contact.id);
                            if (conv) openConversation(conv.id, conv.contactName, conv.avatarUri);
                        }}
                    />
                ));
        }
    }

    if (isContactsLoading || isChatsLoading || isGroupsLoading) {
        return (
            <View style={[styles.screen, styles.loadingScreen]}>
                <ActivityIndicator size="large" color="#543C52" />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <ChatTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                messageBadge={CHAT_TAB_BADGE}
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
        flex: 1,
        backgroundColor: CHAT_COLORS.screenBg,
    },
    panel: {
        flex: 1,
        backgroundColor: CHAT_COLORS.cardBg,
    },
    loadingScreen: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: '#81818D',
        fontSize: 16,
    },
    list: { flex: 1 },
    loader: {
        paddingVertical: 40,
        alignItems: 'center',
    },
});
