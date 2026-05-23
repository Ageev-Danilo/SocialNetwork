import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
    ChatThreadScreen,
    getConversationById,
    MOCK_DM_MESSAGES,
} from '@/modules/chat';

export default function ConversationScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const conversation = getConversationById(id);
    const messages     = MOCK_DM_MESSAGES[id] ?? [];

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
            messages={messages}
        />
    );
}

const styles = StyleSheet.create({
    error: {
        flex:            1,
        justifyContent:  'center',
        alignItems:      'center',
        backgroundColor: '#F3F4F6',
    },
    errorText: {
        color:    '#999',
        fontSize: 16,
    },
});
