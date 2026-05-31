import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ChatThreadScreen } from '@/modules/chat';
import { CHAT_COLORS } from '@/modules/chat/ui/chat-theme';


export default function GroupChatScreen() {
    const { id, title, initials } = useLocalSearchParams<{
        id:       string;
        title:    string;
        initials: string;
    }>();

    if (!title) {
        return (
            <View style={styles.error}>
                <Text style={styles.errorText}>Груповий чат не знайдено</Text>
            </View>
        );
    }

    return (
        <ChatThreadScreen
            title={title}
            initials={initials}
            items={[]}
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