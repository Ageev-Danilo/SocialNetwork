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
import { Icon } from '@/shared/ui';

export default function ChatScreen() {
    const [activeTab, setActiveTab]   = useState<ChatTabId>('contacts');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContacts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return MOCK_CONTACTS;
        return MOCK_CONTACTS.filter(c =>
            c.name.toLowerCase().includes(q) || c.username.toLowerCase().includes(q),
        );
    }, [searchQuery]);

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
                        badge={CHAT_TAB_BADGE}
                        icon={<MessagesTabIcon />}
                    />
                );
            case 'groups':
                return <ChatSectionHeader title="Групові чати" />;
            default:
                return (
                    <ChatSectionHeader
                        title="Контакти"
                        icon={<Icon name="group" size={20} fill='#81818D' />}
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
        flex:            1,
        backgroundColor: CHAT_COLORS.screenBg,
    },
    panel: {
        flex:            1,
        backgroundColor: CHAT_COLORS.cardBg,
    },
    list: { flex: 1 },
});
