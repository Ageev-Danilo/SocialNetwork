import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Button } from '@/shared/ui'
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons'

export default function CreateAlbumModal({ visible }: { visible: boolean }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modal}>

                    <TouchableOpacity 
                        style={styles.closeIcon} 
                        onPress={() => router.back()}
                    >
                        <Feather name="x" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.title}>Створити альбом</Text>

                    <View style={styles.content}>
                        <View style={styles.container}>
                            <Text style={styles.label}>Назва альбому</Text>
                            <View style={styles.inputLike}>
                                <Text style={styles.inputText}>Настрій</Text>
                            </View>
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.label}>Оберіть тему</Text>
                            <TouchableOpacity style={styles.select}>
                                <Text style={styles.selectText}>Природа</Text>
                                <Feather name="chevron-down" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.container}>
                            <Text style={styles.label}>Рік альбому</Text>
                            <TouchableOpacity style={styles.select}>
                                <Text style={styles.selectText}>Оберіть рік</Text>
                                <Feather name="chevron-down" size={20} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={[styles.btnBase, styles.btnCancel]} 
                            onPress={() => router.back()}
                        >
                            <Text style={styles.cancelText}>Скасувати</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.btnBase, styles.btnSave]}>
                            <Text style={styles.saveText}>Зберегти</Text>
                        </TouchableOpacity>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 20,
    },
    modal: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 30,
        borderRadius: 30, 
    },
    closeIcon: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
    title: {
        fontWeight: '700',
        fontSize: 22,
        textAlign: 'left',
        marginBottom: 10,
    },
    content: {
        paddingVertical: 10,
        gap: 20,
    },
    container: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    inputLike: {
        backgroundColor: 'white',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    inputText: {
        color: '#1F2937',
    },
    select: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    selectText: {
        color: '#9CA3AF',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 20,
    },
    btnBase: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnCancel: {
        borderWidth: 1,
        borderColor: '#4B3F52',
    },
    btnSave: {
        backgroundColor: '#4B3F52',
    },
    cancelText: {
        color: '#4B3F52',
        fontWeight: '600',
    },
    saveText: {
        color: 'white',
        fontWeight: '600',
    },
});

//yee