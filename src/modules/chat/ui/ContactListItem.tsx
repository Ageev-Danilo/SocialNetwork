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

function getInitials(name: string, username?: string | null): string {
    const trimmed = name.trim();
    if (trimmed && trimmed !== 'Користувач') {
        const words = trimmed.split(/\s+/).filter(Boolean);
        if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
        return trimmed.slice(0, 2).toUpperCase();
    }
    if (username) {
        const clean = username.replace(/^@/, '').split('@')[0];
        return clean.slice(0, 2).toUpperCase();
    }
    return 'КO';
}

function getDisplayName(name: string): string {
    return name.trim() || 'Користувач';
}

export function ContactListItem({ contact, onPress }: Props) {
    const displayName = getDisplayName(contact.name);
    const initials = getInitials(contact.name, contact.username);

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
                <Text style={styles.name}>{displayName}</Text>
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
        backgroundColor: '#543C52',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
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