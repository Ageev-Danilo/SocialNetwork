import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import {
    ChatTabs,
    ChatListItem,
    ContactListItem,
    MOCK_CONTACTS,
    MOCK_CONVERSATIONS,
    MOCK_GROUP_CHATS,
} from '@/modules/chat';
import type { ChatTabId } from '@/modules/chat';

export default function ChatScreen() {
    const [activeTab, setActiveTab] = useState<ChatTabId>('contacts');

    function openConversation(id: string) {
        router.push(`/(chat)/conversation/${id}` as any);
    }

    function openGroup(id: string) {
        router.push(`/(chat)/group/${id}` as any);
    }

    function renderContent() {
        switch (activeTab) {
            case 'messages':
                return MOCK_CONVERSATIONS.length === 0 ? (
                    <EmptyBlock text="Повідомлень поки немає" />
                ) : (
                    MOCK_CONVERSATIONS.map(conv => (
                        <ChatListItem
                            key={conv.id}
                            title={conv.contactName}
                            subtitle={conv.lastMessage}
                            time={conv.lastMessageTime}
                            avatarUri={conv.avatarUri}
                            unreadCount={conv.unreadCount}
                            onPress={() => openConversation(conv.id)}
                        />
                    ))
                );

            case 'groups':
                return MOCK_GROUP_CHATS.length === 0 ? (
                    <EmptyBlock text="Групових чатів поки немає" />
                ) : (
                    MOCK_GROUP_CHATS.map(group => (
                        <ChatListItem
                            key={group.id}
                            title={group.name}
                            subtitle={group.lastMessage}
                            time={group.lastMessageTime}
                            avatarUri={group.avatarUri}
                            unreadCount={group.unreadCount}
                            onPress={() => openGroup(group.id)}
                        />
                    ))
                );

            default:
                return MOCK_CONTACTS.length === 0 ? (
                    <EmptyBlock text="Контактів поки немає" />
                ) : (
                    MOCK_CONTACTS.map(contact => (
                        <ContactListItem
                            key={contact.id}
                            contact={contact}
                            onPress={() => {
                                const conv = MOCK_CONVERSATIONS.find(c => c.contactId === contact.id);
                                if (conv) openConversation(conv.id);
                            }}
                        />
                    ))
                );
        }
    }

    return (
        <View style={styles.screen}>
            <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <ScrollView style={styles.list}>{renderContent()}</ScrollView>
        </View>
    );
}

function EmptyBlock({ text }: { text: string }) {
    return (
        <View style={styles.empty}>
            <Text style={styles.emptyText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: '#F3F4F6',
    },
    list: { flex: 1 },
    empty: {
        margin:            16,
        padding:           32,
        backgroundColor:   '#fff',
        borderRadius:      12,
        alignItems:        'center',
        borderWidth:       1,
        borderColor:       '#F0F0F0',
    },
    emptyText: {
        color:    '#999',
        fontSize: 14,
    },
});
