import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@/shared/ui';

interface Props {
    onEdit: () => void;
}

function FieldRow({ label, value, hidden }: { label: string; value: string; hidden?: boolean }) {
    return (
        <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.fieldRow}>
                <Text style={styles.fieldValue}>{hidden ? '••••••••••' : value}</Text>
                {hidden && <Icon name="settings" size={16} />}
            </View>
        </View>
    );
}

export function PersonalInfo({ onEdit }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Особиста інформація</Text>
                <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
                    <Icon name="settings" size={16} />
                </TouchableOpacity>
            </View>

            <FieldRow label="Ім'я" value="Ім'я" />
            <FieldRow label="Прізвище" value="Прізвище" />
            <FieldRow label="Дата народження" value="01.01.2000" hidden />
            <FieldRow label="Електронна адреса" value="you@example.com" hidden />

            <View style={styles.divider} />

            <View style={styles.header}>
                <Text style={styles.title}>Пароль</Text>
                <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
                    <Icon name="settings" size={16} />
                </TouchableOpacity>
            </View>
            <FieldRow label="Пароль" value="password" hidden />
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
    fieldWrap: {
        gap: 4,
    },
    fieldLabel: {
        fontSize: 13,
        color: '#888',
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#EBEBEB',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    fieldValue: {
        fontSize: 15,
        color: '#070A1C',
    },
    divider: {
        height: 1,
        backgroundColor: '#EBEBEB',
        marginVertical: 4,
    },
});