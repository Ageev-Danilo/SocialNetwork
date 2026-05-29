import { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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
    MOCK_CONTACTS,
    MOCK_CONVERSATIONS,
    MOCK_GROUP_CHATS,
    CHAT_TAB_BADGE,
} from '@/modules/chat';
import { useGetChatsQuery } from '@/modules/chat/api';
import type { ChatDto } from '@/modules/chat/api';
import type { ChatTabId } from '@/modules/chat';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import { ContactsTabIcon, GroupsTabIcon } from '@/modules/chat/ui/ChatIcons';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';

export default function ChatScreen() {
    const [activeTab, setActiveTab]     = useState<ChatTabId>('contacts');
    const [searchQuery, setSearchQuery] = useState('');
    const [myUserId, setMyUserId]       = useState<number | null>(null);

    const { data: chats = [], isLoading: isChatsLoading } = useGetChatsQuery();

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

    const filteredContacts = useMemo(() => {
        if (!q) return MOCK_CONTACTS;
        return MOCK_CONTACTS.filter(c =>
            c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q),
        );
    }, [q]);

    const filteredChats = useMemo(() => {
        if (!q) return chats;
        return chats.filter(c => getChatTitle(c, myUserId).toLowerCase().includes(q));
    }, [q, chats, myUserId]);

    const filteredGroups = useMemo(() => {
        if (!q) return MOCK_GROUP_CHATS;
        return MOCK_GROUP_CHATS.filter(g =>
            g.name.toLowerCase().includes(q) || g.lastMessage.toLowerCase().includes(q),
        );
    }, [q]);

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

    function openGroup(id: string) {
        router.push(`/(chat)/group/${id}` as any);
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
                if (chats.length > 0) {
                    return filteredChats.map(chat => {
                        const chatTitle  = getChatTitle(chat, myUserId);
                        const chatAvatar = getChatAvatarUri(chat, myUserId);
                        return (
                            <ChatListItem
                                key={chat.id}
                                title={chatTitle}
                                avatarUri={chatAvatar}
                                onPress={() => openConversation(String(chat.id), chatTitle, chatAvatar)} subtitle={''}                            
                            />
                        );
                    });
                }
                return MOCK_CONVERSATIONS.filter(c =>
                    !q || c.contactName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q),
                ).map(conv => (
                    <ChatListItem
                        key={conv.id}
                        title={conv.contactName}
                        subtitle={conv.lastMessage}
                        time={conv.lastMessageTime}
                        avatarUri={conv.avatarUri}
                        highlighted={conv.highlighted}
                        isOnline={conv.isOnline}
                        onPress={() => openConversation(conv.id, conv.contactName, conv.avatarUri)}
                    />
                ));

            case 'groups':
                return filteredGroups.map(group => (
                    <GroupListItem
                        key={group.id}
                        group={group}
                        onPress={() => openGroup(group.id)}
                    />
                ));

            default:
                return filteredContacts.map(contact => (
                    <ContactListItem
                        key={contact.id}
                        contact={contact}
                        onPress={() => {
                            const conv = MOCK_CONVERSATIONS.find(c => c.contactId === contact.id);
                            if (conv) openConversation(conv.id, conv.contactName, conv.avatarUri);
                        }}
                    />
                ));
        }
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
        flex:            1,
        backgroundColor: CHAT_COLORS.screenBg,
    },
    panel: {
        flex:            1,
        backgroundColor: CHAT_COLORS.cardBg,
    },
    list:   { flex: 1 },
    loader: {
        paddingVertical: 40,
        alignItems:      'center',
    },
});