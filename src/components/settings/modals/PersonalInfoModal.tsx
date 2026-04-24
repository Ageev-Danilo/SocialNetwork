import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Input } from '@/shared/ui';

interface Props {
    visible: boolean;
    onClose: () => void;
}

export function PersonalInfoModal({ visible, onClose }: Props) {
    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Особиста інформація</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.body}>
                    {[
                        { label: "Ім'я", holder: "Введи ім'я" },
                        { label: 'Прізвище', holder: 'Введи прізвище' },
                        { label: 'Дата народження', holder: 'ДД.ММ.РРРР' },
                        { label: 'Електронна адреса', holder: 'you@example.com', type: 'email' as const },
                    ].map(({ label, holder, type }) => (
                        <View key={label} style={styles.field}>
                            <Text style={styles.fieldLabel}>{label}</Text>
                            <Input type={type ?? 'text'} holder={holder} />
                        </View>
                    ))}

                    <View style={styles.divider} />
                    <Text style={styles.sectionTitle}>Пароль</Text>

                    {[
                        { label: 'Поточний пароль', holder: 'Введи поточний пароль' },
                        { label: 'Новий пароль', holder: 'Введи новий пароль' },
                        { label: 'Підтверди пароль', holder: 'Повтори новий пароль' },
                    ].map(({ label, holder }) => (
                        <View key={label} style={styles.field}>
                            <Text style={styles.fieldLabel}>{label}</Text>
                            <Input type="pwd" holder={holder} />
                        </View>
                    ))}
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
        gap: 14 
    },
    field: { 
        gap: 6 
    },
    fieldLabel: { 
        fontSize: 14, 
        color: '#070A1C', 
        fontWeight: '500' 
    },
    divider: { 
        height: 1, 
        backgroundColor: '#EBEBEB', 
        marginVertical: 4 
    },
    sectionTitle: { 
        fontSize: 15, 
        fontWeight: '600', 
        color: '#070A1C' 
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
        fontWeight: '600' 
    },
});