import { View, Text, Image, StyleSheet } from 'react-native';
import type { Contact } from '../model/mock-data';
import { CHAT_COLORS } from './chat-theme';
import Ripple from 'react-native-material-ripple';

interface Props {
    data: Contact;
    onPress: () => void;
    sub?: string;
}

export function ChatItem({ data, onPress, sub }: Props) {
    return (
        <Ripple style={styles.row} onPress={onPress}>
            {data.avatarUri ? (
                <Image source={{ uri: data.avatarUri }} style={styles.avatar} />
            ) : (
                <View style={styles.avatarCon}>
                    <Text style={styles.avatarHolder}>
                        {(data.name ?? 'A').slice(0, 2).toUpperCase()}
                    </Text>
                </View>
            )}

            {sub ? (
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{data.name}</Text>
                    <Text style={styles.sub}>{sub}</Text>
                </View>
            ) : (
                <Text style={styles.name}>{data.name}</Text>
            )}
        </Ripple>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection:     'row',
        alignItems:        'center',
        paddingHorizontal: 16,
        paddingVertical:   12,
        gap:               14,
    },
    avatarCon: {
        justifyContent: 'center',
        alignItems:     'center',
        backgroundColor: '#E9E5EE',
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    avatarHolder: {
        color: CHAT_COLORS.primary, 
        fontWeight: '700',
        fontSize: 16,
    },
    avatar: {
        backgroundColor: '#E9E5EE',
        width:        48,
        height:       48,
        borderRadius: 24,
    },
    name: {
        flex:       1,
        fontSize:   16,
        fontWeight: '600',
        color:      CHAT_COLORS.text,
    },
    sub: {
        fontSize: 14,
        color: CHAT_COLORS.textMuted,
    },
});