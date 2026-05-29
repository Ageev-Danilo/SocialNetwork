import { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text } from 'react-native';
import { router } from 'expo-router';
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
import { useGetFriendsQuery } from '@/modules/friends';
import type { ChatTabId } from '@/modules/chat';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import { Icon } from '@/shared/ui';

const API_MEDIA_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';

function buildAvatarUri(profileImage: string | null | undefined): string {
    if (!profileImage) return 'https://g-issues.com/wp-content/uploads/2019/08/default-avatar.png';
    if (profileImage.startsWith('http') || profileImage.startsWith('file')) return profileImage;
    if (profileImage.startsWith('/media')) return `${API_MEDIA_BASE}${profileImage}`;
    return `${API_MEDIA_BASE}/media/thumbnail/${profileImage}`;
}

export default function ChatScreen() {
    const [activeTab, setActiveTab] = useState<ChatTabId>('contacts');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: friendsData = [], isLoading: isFriendsLoading } = useGetFriendsQuery();

    const mappedContacts = useMemo(
        () =>
            friendsData.map(friend => ({
                id: String(friend.contactProfile.id),
                name: friend.contactProfile.pseudonym || 'Контакт',
                username: friend.contactProfile.username || 'user',
                avatarUri: buildAvatarUri(friend.contactProfile.profileImage),
                isOnline: false,
            })),
        [friendsData],
    );

    const filteredContacts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return mappedContacts;
        return mappedContacts.filter(
            c => c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q),
        );
    }, [searchQuery, mappedContacts]);

    function openConversation(id: string) {
        router.push(`/(chat)/conversation/${id}` as any);
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
                        icon={<MessagesTabIcon />}
                    />
                );
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
                return MOCK_CONVERSATIONS.map(conv => (
                    <ChatListItem
                        key={conv.id}
                        title={conv.contactName}
                        subtitle={conv.lastMessage}
                        time={conv.lastMessageTime}
                        avatarUri={conv.avatarUri}
                        highlighted={conv.highlighted}
                        isOnline={conv.isOnline}
                        onPress={() => openConversation(conv.id)}
                    />
                ));

            case 'groups':
                return MOCK_GROUP_CHATS.map(group => (
                    <GroupListItem
                        key={group.id}
                        group={group}
                        onPress={() => openGroup(group.id)}
                    />
                ));

            default:
                if (filteredContacts.length === 0) {
                    return (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>У вас ще немає контактів</Text>
                        </View>
                    );
                }

                return filteredContacts.map(contact => (
                    <ContactListItem
                        key={contact.id}
                        contact={contact}
                        onPress={() => {
                            const conv = MOCK_CONVERSATIONS.find(c => c.contactId === contact.id);
                            if (conv) openConversation(conv.id);
                        }}
                    />
                ));
        }
    }

    if (isFriendsLoading) {
        return (
            <View style={[styles.screen, styles.loadingScreen]}>
                <ActivityIndicator size="large" color="#543C52" />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <View style={styles.panel}>
                {renderSectionHeader()}
                {activeTab === 'contacts' && (
                    <ChatSearchBar value={searchQuery} onChangeText={setSearchQuery} />
                )}
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
    list: { flex: 1 },
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
});
