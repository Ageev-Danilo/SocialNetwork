import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import type { Contact } from '../model/mock-data';
import { CHAT_COLORS } from './chat-theme';

interface Props {
    contact: Contact;
    onPress: () => void;
}

export function ContactListItem({ contact, onPress }: Props) {
    return (
        <Pressable style={styles.row} onPress={onPress}>
            <Image source={{ uri: contact.avatarUri }} style={styles.avatar} />
            <Text style={styles.name}>{contact.name}</Text>
        </Pressable>
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
    avatar: {
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
});
