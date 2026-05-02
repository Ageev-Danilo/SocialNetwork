import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button } from '@/shared/ui';
import { router } from 'expo-router';

export default function CreateAlbumModal({ visible }: { visible: boolean }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>

                    <View style={styles.close}>
                        <Button
                            type="outlined"
                            text="×"
                            style={styles.closeBtn}
                            onPress={() => router.back()}
                        />
                    </View>

                    <Text style={styles.title}>Створити альбом</Text>

                    <View style={styles.content}>
                        <View style={styles.container}>
                            <Text style={styles.label}>Назва альбому</Text>
                            <View style={{ backgroundColor: '#F3F4F6', padding: 12, borderRadius: 12 }}>
                                <Text style={{ color: '#6B7280' }}>Введіть назву</Text>
                            </View>
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.label}>Оберіть тему</Text>
                            <TouchableOpacity style={styles.select}>
                                <Text style={styles.selectText}>Природа</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.label}>Рік альбому</Text>
                            <TouchableOpacity style={styles.select}>
                                <Text style={styles.selectText}>Оберіть рік</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.next}>
                        <Button text="Зберегти" />
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
        paddingBottom: 44,
        borderRadius: 20,
    },
    close: {
        alignItems: 'flex-end',
    },
    closeBtn: {
        width: 47,
    },
    title: {
        fontWeight: '500',
        fontSize: 24,
        textAlign: 'center',
    },
    content: {
        paddingVertical: 24,
        gap: 24,
    },
    container: {
        gap: 6,
    },
    label: {
        fontSize: 16,
    },
    select: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 12,
    },
    selectText: {
        color: '#6B7280',
    },
    next: {
        alignItems: 'flex-end',
    },
});
