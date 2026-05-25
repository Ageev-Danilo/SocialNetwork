import { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import {
    ChatTabs,
    ChatListItem,
    ContactListItem,
    GroupListItem,
    ChatSectionHeader,
    ChatSearchBar,
    UserAddIcon,
    MessagesTabIcon,
    MOCK_CONTACTS,
    MOCK_CONVERSATIONS,
    MOCK_GROUP_CHATS,
    CHAT_TAB_BADGE,
} from '@/modules/chat';
import type { ChatTabId } from '@/modules/chat';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import { ContactsTabIcon, GroupsTabIcon } from '@/modules/chat/ui/ChatIcons';


export default function ChatScreen() {
    const [activeTab, setActiveTab]     = useState<ChatTabId>('contacts');
    const [searchQuery, setSearchQuery] = useState('');

    const q = searchQuery.trim().toLowerCase();

    const filteredContacts = useMemo(() => {
        if (!q) return MOCK_CONTACTS;
        return MOCK_CONTACTS.filter(c =>
            c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q),
        );
    }, [q]);

    const filteredConversations = useMemo(() => {
        if (!q) return MOCK_CONVERSATIONS;
        return MOCK_CONVERSATIONS.filter(c =>
            c.contactName.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q),
        );
    }, [q]);

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
                        icon={<MessagesTabIcon color={CHAT_COLORS.textMuted} size={20} />}
                        //rightIcon={<MessagesTabIcon />}
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
                        //rightIcon={<UserAddIcon />}
                    />
                );
        }
    }

    function renderContent() {
        switch (activeTab) {
            case 'messages':
                return filteredConversations.map(conv => (
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
                            if (conv) openConversation(conv.id);
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
    list: { flex: 1 },
});