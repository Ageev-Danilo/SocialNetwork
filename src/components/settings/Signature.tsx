import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@/shared/ui';

interface Props {
    onEdit: () => void;
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

export function Signature({ onEdit }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Варіанти підпису</Text>
                <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
                    <Icon name="settings" size={16} />
                </TouchableOpacity>
            </View>

            <CheckRow label="Псевдонім автора" checked />
            <Text style={styles.sigName}>Ім'я Прізвище</Text>

            <CheckRow label="Мій електронний підпис" checked />
            <View style={styles.signatureBox}>
                <Text style={styles.signaturePlaceholder}>[ підпис ]</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        gap: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#070A1C',
    },
    editBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#CDCED2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
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
        borderColor: '#543C52',
    },
    checkmark: {
        color: 'white',
        fontSize: 11,
        fontWeight: '700',
    },
    checkLabel: {
        fontSize: 14,
        color: '#070A1C',
    },
    sigName: {
        fontSize: 15,
        color: '#070A1C',
        marginLeft: 26,
    },
    signatureBox: {
        marginLeft: 26,
        height: 50,
        justifyContent: 'center',
    },
    signaturePlaceholder: {
        fontSize: 22,
        color: '#CDCED2',
        fontStyle: 'italic',
    },
});