import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CHAT_COLORS } from './chat-theme';

interface Props {
    title: string;
    subtitle?: string;
    time?: string;
    avatarUri?: string;
    highlighted?: boolean;
    isOnline?: boolean;
    unreadCount?: number;
    isGroup?: boolean;
    onPress: () => void;
}

function getInitials(text: string): string {
    const cleanText = text.trim().replace(/^@/, '');
    const words = cleanText.split(/\s+/);
    if (words.length >= 2 && words[0] && words[1]) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return cleanText.slice(0, 2).toUpperCase();
}

export function ChatListItem({
    title, subtitle, time, avatarUri, highlighted,
    isOnline, unreadCount, isGroup, onPress,
}: Props) {
    const displayTitle = title || 'Користувач';
    const initials = getInitials(displayTitle);
    const rowStyles = [styles.row, highlighted && styles.rowHighlighted];
    const fallbackStyles = [styles.avatar, styles.avatarFallback];
    const hasUnread = (unreadCount ?? 0) > 0;

    return (
        <Pressable style={rowStyles} onPress={onPress}>
            <View style={styles.avatarWrap}>
                {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                    <View style={fallbackStyles}>
                        <Text style={styles.avatarInitials}>{initials}</Text>
                    </View>
                )}
                {isOnline && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.body}>
                <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>
                        {displayTitle}
                    </Text>
                    <View style={styles.rightMeta}>
                        {time ? <Text style={styles.time}>{time}</Text> : null}
                        {hasUnread && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadBadgeText}>
                                    {unreadCount! > 99 ? '99+' : unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                {subtitle ? (
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {subtitle}
                    </Text>
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
        paddingVertical: 14,
        backgroundColor: CHAT_COLORS.cardBg,
        gap: 12,
    },
    rowHighlighted: { backgroundColor: CHAT_COLORS.highlight },
    avatarWrap: { position: 'relative' },
    avatar: { width: 52, height: 52, borderRadius: 26 },
    avatarFallback: { backgroundColor: '#543C52', justifyContent: 'center', alignItems: 'center' },
    avatarInitials: { fontSize: 16, fontWeight: '700', color: '#fff' },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: CHAT_COLORS.online,
        borderWidth: 2,
        borderColor: '#fff',
    },
    body: { flex: 1, gap: 4 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
    rightMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    title: { flex: 1, fontSize: 16, fontWeight: '700', color: CHAT_COLORS.text },
    subtitle: { fontSize: 14, color: '#070A1C' },
    time: { fontSize: 13, color: CHAT_COLORS.textMuted },
    unreadBadge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E53935',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    unreadBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});