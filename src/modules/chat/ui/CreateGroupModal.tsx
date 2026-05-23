import { useState } from 'react';
import {
    Modal, View, TouchableOpacity, Text, StyleSheet,
    Dimensions, ScrollView, Alert,
} from 'react-native';
import { Input, Button } from '@/shared/ui';
import { MOCK_CONTACTS } from '../model/mock-data';

const { height: SCREEN_H } = Dimensions.get('window');

interface Props {
    visible: boolean;
    onClose: () => void;
}

export function CreateGroupModal({ visible, onClose }: Props) {
    const [name, setName]               = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    function toggleMember(id: string) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function handleClose() {
        setName('');
        setSelectedIds(new Set());
        onClose();
    }

    function handleCreate() {
        if (!name.trim()) {
            Alert.alert('Помилка', 'Введіть назву групи');
            return;
        }
        Alert.alert('Групу створено', `«${name.trim()}» — ${selectedIds.size} учасників (заглушка)`);
        handleClose();
    }

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Нова група</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                        <Input
                            label="Назва групи"
                            holder="Введіть назву..."
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.membersLabel}>Учасники</Text>
                        {MOCK_CONTACTS.map(contact => {
                            const selected = selectedIds.has(contact.id);
                            return (
                                <TouchableOpacity
                                    key={contact.id}
                                    style={[styles.memberRow, selected && styles.memberRowSelected]}
                                    onPress={() => toggleMember(contact.id)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.memberName}>{contact.name}</Text>
                                    <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                                        {selected && <Text style={styles.checkmark}>✓</Text>}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.footer}>
                        <Button type="outline" text="Скасувати" onPress={handleClose} />
                        <Button type="fill" text="Створити" onPress={handleCreate} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex:            1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent:  'center',
        alignItems:      'center',
        padding:         20,
    },
    modalCard: {
        width:           '100%',
        maxHeight:       SCREEN_H * 0.8,
        backgroundColor: '#fff',
        borderRadius:    28,
        overflow:        'hidden',
    },
    header: {
        flexDirection:     'row',
        justifyContent:    'space-between',
        alignItems:        'center',
        paddingHorizontal: 20,
        paddingTop:        22,
        paddingBottom:     12,
    },
    title:     { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
    closeBtn:  { width: 30, height: 30, justifyContent: 'center', alignItems: 'center' },
    closeText: { fontSize: 20, color: '#000', fontWeight: '300' },
    content: {
        paddingHorizontal: 20,
        paddingBottom:     12,
        gap:               12,
    },
    membersLabel: {
        fontSize:   16,
        fontWeight: '700',
        color:      '#1A1A1A',
        marginTop:  16,
        marginBottom: 8,
    },
    memberRow: {
        flexDirection:     'row',
        justifyContent:    'space-between',
        alignItems:        'center',
        paddingVertical:   12,
        paddingHorizontal: 12,
        borderRadius:      12,
        borderWidth:       1,
        borderColor:       '#F0F0F0',
        marginBottom:      8,
    },
    memberRowSelected: {
        borderColor:     '#543C52',
        backgroundColor: '#F9F7FA',
    },
    memberName: {
        fontSize:   15,
        fontWeight: '600',
        color:      '#1A1A1A',
    },
    checkbox: {
        width:           24,
        height:          24,
        borderRadius:    12,
        borderWidth:     2,
        borderColor:     '#D0D0D0',
        justifyContent:  'center',
        alignItems:      'center',
    },
    checkboxSelected: {
        backgroundColor: '#543C52',
        borderColor:     '#543C52',
    },
    checkmark: {
        color:      '#fff',
        fontSize:   14,
        fontWeight: '700',
    },
    footer: {
        flexDirection:     'row',
        gap:               12,
        padding:           20,
        borderTopWidth:    1,
        borderTopColor:    '#F0F0F0',
    },
});
