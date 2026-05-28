import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ClientSocket } from '@/shared/api';
import { ChatThreadScreen, getConversationById } from '@/modules/chat';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';
import type { ThreadItem } from '@/modules/chat';


export default function ConversationScreen() {
    const { id }       = useLocalSearchParams<{ id: string }>();
    const conversation = getConversationById(id);
    const [items, setItems] = useState<ThreadItem[]>([]);

    useEffect(() => {
        ClientSocket.emit('chat:join', id, (response) => {
            if (response.joined) {
                console.log('Joined chat:', id);
            }
        });

        function onNewMessage(data: { userId: string; message: string }) {
            const newItem: ThreadItem = {
                type: 'message',
                id:   `msg-${Date.now()}`,
                data: {
                    id:     `msg-${Date.now()}`,
                    text:   data.message,
                    time:   new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
                    isMine: false,
                    status: 'sent',
                },
            };
            setItems(prev => [...prev, newItem]);
        }

        ClientSocket.on('chat:new-message', onNewMessage);

        return () => {
            ClientSocket.emit('chat:leave', id, (response) => {
                if (response.left) {
                    console.log('Left chat:', id);
                }
            });
            ClientSocket.off('chat:new-message', onNewMessage);
        };
    }, [id]);

    function handleSendMessage(text: string) {
        ClientSocket.emit('chat:message', { chatId: id, message: text }, (response) => {
            if (response.delivered) {
                console.log('Message delivered:', response);
                const newItem: ThreadItem = {
                    type: 'message',
                    id:   `mine-${Date.now()}`,
                    data: {
                        id:     `mine-${Date.now()}`,
                        text,
                        time:   new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
                        isMine: true,
                        status: 'sent',
                    },
                };
                setItems(prev => [...prev, newItem]);
            }
        });
    }

    if (!conversation) {
        return (
            <View style={styles.error}>
                <Text style={styles.errorText}>Чат не знайдено</Text>
            </View>
        );
    }

    return (
        <ChatThreadScreen
            title={conversation.contactName}
            avatarUri={conversation.avatarUri}
            items={items}
            onSendMessage={handleSendMessage}
        />
    );
}

const styles = StyleSheet.create({
    error: {
        flex:            1,
        justifyContent:  'center',
        alignItems:      'center',
        backgroundColor: CHAT_COLORS.screenBg,
    },
    errorText: {
        color:    CHAT_COLORS.textLight,
        fontSize: 16,
    },
});