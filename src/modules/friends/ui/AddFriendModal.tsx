import React, { useState } from 'react';
import { Modal, View, TextInput, StyleSheet } from 'react-native';
import Button from '@/shared/ui/Button';
import { useSendFriendRequestMutation } from '../api/friends.api';

export default function AddFriendModal({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const [id, setId] = useState('');
    const [sendRequest, { isLoading }] = useSendFriendRequestMutation();

    const handleSend = async () => {
        if (!id) return;
        try {
            await sendRequest({ receiverId: Number(id) }).unwrap();
            setId('');
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <TextInput 
                        style={styles.input} 
                        placeholder="ID користувача" 
                        value={id}
                        onChangeText={setId}
                        keyboardType="numeric"
                    />
                    <View style={styles.row}>
                        <Button type="outlined" text="Скасувати" onPress={onClose} style={{flex: 1}} />
                        <Button text={isLoading ? "..." : "Додати"} onPress={handleSend} style={{flex: 1}} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },

    modal: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        gap: 15,
    },

    input: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        padding: 12,
    },

    row: {
        flexDirection: 'row',
        gap: 10,
    },
});