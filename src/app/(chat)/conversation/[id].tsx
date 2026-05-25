import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
    ChatThreadScreen,
    getConversationById,
    getDmThread,
} from '@/modules/chat';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';

export default function ConversationScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const conversation = getConversationById(id);
    const items        = getDmThread(id);

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
