import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
    ChatThreadScreen,
    getGroupChatById,
    getGroupThread,
    getGroupSubtitle,
} from '@/modules/chat';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';

export default function GroupChatScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const group    = getGroupChatById(id);
    const items    = getGroupThread(id);

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
            subtitle={getGroupSubtitle(group)}
            initials={group.initials}
            avatarUri={group.avatarUri}
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
