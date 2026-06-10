import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';


export interface FriendCardData {
    id: number;
    name: string;
    username: string;
    avatar: any;
}

interface Props {
    data: FriendCardData;
    mode: 'request' | 'recommendation' | 'friend';
    onConfirm?: () => void;
    onRemove?:  () => void;
}

export function FriendCard({ data, mode, onConfirm, onRemove }: Props) {
    const confirmLabel =
        mode === 'request' ? 'Підтвердити' :
        mode === 'recommendation' ? 'Додати' : 'Повідомлення';

    return (
        <View style={styles.card}>
            <View style={styles.avatarWrap}>
                <Image source={data.avatar} style={styles.avatar} />
                <View style={styles.onlineDot} />
            </View>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.username}>@{data.username}</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.btnPrimary} onPress={onConfirm}>
                    <Text style={styles.btnPrimaryText}>{confirmLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnOutline} onPress={onRemove}>
                    <Text style={styles.btnOutlineText}>Видалити</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        padding: 20,
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    avatarWrap: { position: 'relative', marginBottom: 6 },
    avatar: { width: 90, height: 90, borderRadius: 45 },
    onlineDot: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#D0D0D0',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: { fontSize: 24, fontWeight: '700', color: '#070A1C' },
    username: { fontSize: 14, color: '#070A1C' },
    actions: { flexDirection: 'row', gap: 10, marginTop: 10 },
    btnPrimary: {
        backgroundColor: '#6B4F6A',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 22,
    },
    btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    btnOutline: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 22,
    },
    btnOutlineText: { color: '#1A1A1A', fontWeight: '600', fontSize: 14 },
});