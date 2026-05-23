import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

interface Props {
    title:            string;
    subtitle:         string;
    time?:            string;
    avatarUri:        string;
    unreadCount?:     number;
    onPress:          () => void;
}

export function ChatListItem({ title, subtitle, time, avatarUri, unreadCount, onPress }: Props) {
    return (
        <Pressable style={styles.row} onPress={onPress}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <View style={styles.body}>
                <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    {time ? <Text style={styles.time}>{time}</Text> : null}
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
                    {unreadCount != null && unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
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
        backgroundColor:   '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap:               12,
    },
    avatar: {
        width:        52,
        height:       52,
        borderRadius: 26,
    },
    body: { flex: 1, gap: 4 },
    topRow: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
        gap:            8,
    },
    bottomRow: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
        gap:            8,
    },
    title: {
        flex:       1,
        fontSize:   16,
        fontWeight: '700',
        color:      '#1A1A1A',
    },
    subtitle: {
        flex:     1,
        fontSize: 14,
        color:    '#81818D',
    },
    time: {
        fontSize: 12,
        color:    '#999',
    },
    badge: {
        minWidth:          22,
        height:            22,
        borderRadius:      11,
        backgroundColor:   '#543C52',
        justifyContent:    'center',
        alignItems:        'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        color:      '#fff',
        fontSize:   12,
        fontWeight: '700',
    },
});
