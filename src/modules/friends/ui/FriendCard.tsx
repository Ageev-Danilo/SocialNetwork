import { View, Text, Image, StyleSheet } from 'react-native';
import Button from '@/shared/ui/Button';

export default function FriendCard({ friend }: { friend: any }) {
    return (
        <View style={styles.card}>
            <Image 
                source={{ uri: friend.profileImage || 'https://placehold.co/100x100' }} 
                style={styles.avatar} 
            />
            <View style={styles.info}>
                <Text style={styles.name}>{friend.firstName} {friend.lastName}</Text>
                <Text style={styles.username}>@{friend.username}</Text>
            </View>
            <View style={styles.actions}>
                <Button text="Повідомлення" style={styles.btn} onPress={() => {}} />
                <Button type="outlined" text="Видалити" style={styles.btn} />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
    },

    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },

    info: {
        alignItems: 'center',
        marginBottom: 16,
    },

    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },

    username: {
        fontSize: 14,
        color: '#6B7280',
    },

    actions: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },

    btn: {
        flex: 1,
    },
});