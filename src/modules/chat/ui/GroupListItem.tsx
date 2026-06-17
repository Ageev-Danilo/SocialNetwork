import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { GroupChat } from '../model/mock-data';
import { CHAT_COLORS } from './chat-theme';

interface Props {
    group: GroupChat;
    onPress: () => void;
}

export function GroupListItem({ group, onPress }: Props) {
    const initials = group.initials ?? group.name.slice(0, 2).toUpperCase();

    return (
        <Pressable style={styles.row} onPress={onPress}>
            <View style={styles.avatar}>
                <Text style={styles.initials}>{initials}</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>{group.name}</Text>
                    <Text style={styles.time}>{group.lastMessageTime}</Text>
                </View>
                <Text style={styles.subtitle} numberOfLines={1}>{group.lastMessage}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: CHAT_COLORS.cardBg,
        gap: 12,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26, 
        backgroundColor: '#543C52',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',  
    },
    body: { flex: 1, gap: 4 },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: CHAT_COLORS.text,
    },
    subtitle: {
        fontSize: 14,
        color: CHAT_COLORS.textMuted,
    },
    time: {
        fontSize: 13,
        color: CHAT_COLORS.textMuted,
    },
});