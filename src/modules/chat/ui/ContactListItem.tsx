import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { Contact } from '../model/mock-data';

interface Props {
    contact: Contact;
    onPress: () => void;
}

export function ContactListItem({ contact, onPress }: Props) {
    return (
        <Pressable style={styles.row} onPress={onPress}>
            <View style={styles.avatarWrap}>
                <Image source={{ uri: contact.avatarUri }} style={styles.avatar} />
                {contact.isOnline && <View style={styles.onlineDot} />}
            </View>
            <View style={styles.body}>
                <Text style={styles.name}>{contact.name}</Text>
                <Text style={styles.username}>@{contact.username}</Text>
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
        backgroundColor: '#4CAF50',
        borderWidth:     2,
        borderColor:     '#fff',
    },
    body: { flex: 1, gap: 2 },
    name: {
        fontSize:   16,
        fontWeight: '700',
        color:      '#1A1A1A',
    },
    username: {
        fontSize: 14,
        color:    '#81818D',
    },
});
