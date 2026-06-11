import { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';

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
    onRemove?: () => void;
}

export function FriendCard({ data, mode, onConfirm, onRemove }: Props) {
    const [confirmVisible, setConfirmVisible] = useState(false);

    const confirmLabel =
        mode === 'request' ? 'Підтвердити' :
        mode === 'recommendation' ? 'Додати' : 'Повідомлення';

    function handleRemovePress() {
        setConfirmVisible(true);
    }

    function handleConfirmRemove() {
        setConfirmVisible(false);
        onRemove?.();
    }

    return (
        <>
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
                    <TouchableOpacity style={styles.btnOutline} onPress={handleRemovePress}>
                        <Text style={styles.btnOutlineText}>Видалити</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={confirmVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmVisible(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setConfirmVisible(false)}>
                    <Pressable style={styles.dialog} onPress={() => {}}>
                        <Text style={styles.dialogTitle}>Підтвердити дію</Text>
                        <Text style={styles.dialogText}>Ви дійсно хочете видалити користувача?</Text>
                        <View style={styles.dialogActions}>
                            <TouchableOpacity
                                style={styles.dialogBtnOutline}
                                onPress={() => setConfirmVisible(false)}
                            >
                                <Text style={styles.dialogBtnOutlineText}>Скасувати</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dialogBtnFill}
                                onPress={handleConfirmRemove}
                            >
                                <Text style={styles.dialogBtnFillText}>Підтвердити</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    dialog: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 28,
        width: '100%',
        alignItems: 'center',
        gap: 12,
    },
    dialogTitle: {
        fontSize: 24,
        fontWeight: '500',
        color: '#070A1C',
        textAlign: 'center',
        lineHeight: 24,
    },
    dialogText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#070A1C',
        textAlign: 'center',
        lineHeight: 16,
    },
    dialogActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    dialogBtnOutline: {
        borderWidth: 1,
        borderColor: '#543C52',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    dialogBtnOutlineText: { 
        color: '#543C52', 
        fontWeight: '600', 
        fontSize: 15,
    },
    dialogBtnFill: {
        backgroundColor: '#543C52',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    dialogBtnFillText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});