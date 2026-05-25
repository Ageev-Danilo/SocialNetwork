import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { CHAT_COLORS } from './chat-theme';

interface Props {
    title:         string;
    subtitle:      string;
    time?:         string;
    avatarUri:     string;
    highlighted?:  boolean;
    isOnline?:     boolean;
    onPress:       () => void;
}

export function ChatListItem({
    title, subtitle, time, avatarUri, highlighted, isOnline, onPress,
}: Props) {
    return (
        <Pressable
            style={[styles.row, highlighted && styles.rowHighlighted]}
            onPress={onPress}
        >
            <View style={styles.avatarWrap}>
                <Image source={{ uri: avatarUri }} style={styles.avatar} />
                {isOnline && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.body}>
                <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    {time ? <Text style={styles.time}>{time}</Text> : null}
                </View>
                <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection:     'row',
        alignItems:        'center',
        paddingHorizontal: 16,
        paddingVertical:   14,
        backgroundColor:   CHAT_COLORS.cardBg,
        gap:               12,
    },
    rowHighlighted: {
        backgroundColor: CHAT_COLORS.highlight,
    },
    avatarWrap: { position: 'relative' },
    avatar: {
        width:        52,
        height:       52,
        borderRadius: 26,
    },
    onlineDot: {
        position:        'absolute',
        bottom:          2,
        right:           2,
        width:           12,
        height:          12,
        borderRadius:    6,
        backgroundColor: CHAT_COLORS.online,
        borderWidth:     2,
        borderColor:     '#fff',
    },
    body: { flex: 1, gap: 4 },
    topRow: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
        gap:            8,
    },
    title: {
        flex:       1,
        fontSize:   16,
        fontWeight: '700',
        color:      CHAT_COLORS.text,
    },
    subtitle: {
        fontSize: 14,
        color:    CHAT_COLORS.textMuted,
    },
    time: {
        fontSize: 13,
        color:    CHAT_COLORS.textMuted,
    },
});
