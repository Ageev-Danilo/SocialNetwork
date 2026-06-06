import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { CHAT_COLORS } from './chat-theme';


export interface ContactItemData {
    id: number;
    userId?: number;
    name: string;
    username?: string | null;
    avatarUri?: string;
    isOnline?: boolean;
}

interface Props {
    contact: ContactItemData;
    onPress: () => void;
}

export function ContactListItem({ contact, onPress }: Props) {
    const initials = contact.name.slice(0, 2).toUpperCase();
    return (
        <Pressable style={styles.row} onPress={onPress}>
            <View style={styles.avatarWrap}>
                {contact.avatarUri ? (
                    <Image source={{ uri: contact.avatarUri }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarFallback]}>
                        <Text style={styles.initials}>{initials}</Text>
                    </View>
                )}
                {contact.isOnline && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.body}>
                <Text style={styles.name}>{contact.name}</Text>
                {contact.username ? (
                    <Text style={styles.username}>@{contact.username}</Text>
                ) : null}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 14,
    },
    avatarWrap: { position: 'relative' },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    avatarFallback: {
        backgroundColor: CHAT_COLORS.highlight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 15,
        fontWeight: '700',
        color: CHAT_COLORS.primary,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: CHAT_COLORS.online,
        borderWidth: 2,
        borderColor: '#fff',
    },
    body: { flex: 1 },
    name: { fontSize: 16, fontWeight: '600', color: CHAT_COLORS.text },
    username: { fontSize: 13, color: CHAT_COLORS.textMuted, marginTop: 2 },
});