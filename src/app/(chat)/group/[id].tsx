import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
    ChatThreadScreen,
    getGroupChatById,
    MOCK_GROUP_MESSAGES,
} from '@/modules/chat';

export default function GroupChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const group    = getGroupChatById(id);
    const messages = MOCK_GROUP_MESSAGES[id] ?? [];

    if (!group) {
        return (
            <View style={styles.error}>
                <Text style={styles.errorText}>Груповий чат не знайдено</Text>
            </View>
        );
    }

    return (
        <ChatThreadScreen
            title={group.name}
            subtitle={`${group.membersCount} учасників`}
            avatarUri={group.avatarUri}
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
