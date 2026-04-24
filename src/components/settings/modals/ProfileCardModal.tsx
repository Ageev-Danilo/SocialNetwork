import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Input } from '@/shared/ui';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export function ProfileCardModal({ visible, onClose }: Props) {
    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Картка профілю</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.body}>
                    <Text style={styles.label}>Оберіть або завантажте фото профілю</Text>

                    <View style={styles.avatarWrap}>
                        <Image
                            source={require('../../../../assets/group.svg')}
                            style={styles.avatar}
                        />
                    </View>

                    <View style={styles.photoActions}>
                        <TouchableOpacity style={styles.photoBtn}>
                            <Text style={styles.photoBtnText}>+ Додайте фото</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.photoBtn}>
                            <Text style={styles.photoBtnText}>🖼 Оберіть фото</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Ім'я користувача</Text>
                        <Input type="text" holder="@username" />
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveBtn} onPress={onClose}>
                        <Text style={styles.saveBtnText}>Зберегти</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: 'white' 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
    },
    title: { 
        fontSize: 17,
        fontWeight: '600', 
        color: '#070A1C' 
    },
    closeBtn: {
        width: 36, 
        height: 36, 
        borderRadius: 18,
        borderWidth: 1, 
        borderColor: '#CDCED2',
        alignItems: 'center', 
        justifyContent: 'center',
    },
    closeText: { 
        fontSize: 16, 
        color: '#070A1C' 
    },
    body: { 
        padding: 16, 
        gap: 16, 
        alignItems: 'center' 
    },
    label: { 
        fontSize: 14, 
        color: '#888', 
        textAlign: 'center' 
    },
    avatarWrap: {
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        overflow: 'hidden',
    },
    avatar: { 
        width: '100%', 
        height: '100%' 
    },
    photoActions: { 
        flexDirection: 'row', 
        gap: 12 
    },
    photoBtn: {
        paddingHorizontal: 16, 
        paddingVertical: 10,
        borderWidth: 1, 
        borderColor: '#CDCED2', 
        borderRadius: 10,
    },
    photoBtnText: { 
        fontSize: 14, 
        color: '#543C52' 
    },
    field: { 
        width: '100%', 
        gap: 6 
    },
    fieldLabel: { 
        fontSize: 14, 
        color: '#070A1C', 
        fontWeight: '500' 
    },
    footer: { 
        padding: 16, 
        borderTopWidth: 1, 
        borderTopColor: '#EBEBEB' 
    },
    saveBtn: {
        backgroundColor: '#543C52', 
        borderRadius: 60,
        paddingVertical: 14, 
        alignItems: 'center',
    },
    saveBtnText: { 
        color: 'white', 
        fontSize: 16, 
        fontWeight: '600' },
});