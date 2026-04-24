import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Input } from '@/shared/ui';

interface Props {
    visible: boolean;
    onClose: () => void;
}

function CheckRow({ label, checked }: { label: string; checked?: boolean }) {
    return (
        <View style={styles.checkRow}>
            <View style={[styles.checkbox, checked && styles.checkboxActive]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>{label}</Text>
        </View>
    );
}

export function SignatureModal({ visible, onClose }: Props) {
    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Варіанти підпису</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.body}>
                    <CheckRow label="Псевдонім автора" checked />
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Псевдонім</Text>
                        <Input type="text" holder="Введи псевдонім" />
                    </View>

                    <View style={styles.divider} />

                    <CheckRow label="Мій електронний підпис" checked />
                    <View style={styles.signatureBox}>
                        <Text style={styles.signaturePlaceholder}>[ намалюй підпис тут ]</Text>
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
        gap: 14 
    },
    checkRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8 
    },
    checkbox: {
        width: 18, 
        height: 18, 
        borderRadius: 4,
        borderWidth: 1.5, 
        borderColor: '#CDCED2',
        alignItems: 'center', 
        justifyContent: 'center',
    },
    checkboxActive: { 
        backgroundColor: '#543C52', 
        borderColor: '#543C52' 
    },
    checkmark: { 
        color: 'white', 
        fontSize: 11, 
        fontWeight: '700' 
    },
    checkLabel: { 
        fontSize: 14, 
        color: '#070A1C'
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
    signatureBox: {
        height: 100, 
        borderWidth: 1, 
        borderColor: '#CDCED2',
        borderRadius: 10, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    signaturePlaceholder: { 
        fontSize: 16, 
        color: '#CDCED2', 
        fontStyle: 'italic' 
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