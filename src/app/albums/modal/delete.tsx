import { View, Text, StyleSheet, Modal } from 'react-native';
import { Button } from '@/shared/ui';
import { router } from 'expo-router';

export default function DeleteAlbumModal({ visible }: { visible: boolean }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>

                    <Text style={styles.title}>Видалити альбом?</Text>
                    <Text style={styles.sub}>Цю дію неможливо скасувати.</Text>

                    <View style={styles.row}>
                        <Button
                            text="Скасувати"
                            type="outlined"
                            onPress={() => router.back()}
                        />
                        <Button text="Видалити" />
                    </View>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
    },
    modal: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 32,
        borderRadius: 20,
        gap: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
    },
    sub: {
        textAlign: 'center',
        color: '#6B7280',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
});
