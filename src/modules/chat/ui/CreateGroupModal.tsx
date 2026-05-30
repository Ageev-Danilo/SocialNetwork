import { useState, useMemo } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions, ScrollView, Alert, Image, TextInput } from 'react-native';
import { Button } from '@/shared/ui';
import { MOCK_CONTACTS } from '../model/mock-data';
import { SearchIcon } from './ChatIcons';
import { CHAT_COLORS } from './chat-theme';


interface Props {
    visible: boolean;
    onClose: () => void;
}

const { height: SCREEN_H } = Dimensions.get('window');
const MAX_MODAL_HEIGHT = SCREEN_H * 0.9;
const ERROR_TITLE = 'Помилка';
const ERROR_MSG = 'Оберіть хоча б одного учасника';
const SUCCESS_TITLE = 'Групу створено';
const SUCCESS_MSG_SUFFIX = ' учасників (заглушка)';
const PLACEHOLDER_SEARCH = 'Пошук';
const TITLE_MODAL = 'Нова група';
const TXT_CANCEL = 'Скасувати';
const TXT_NEXT = 'Далі';
const ICON_CLOSE = '✕';
const ICON_CHECK = '✓';
const SELECTED_PREFIX = 'Вибрано: ';
const COLOR_OVERLAY = 'rgba(0,0,0,0.5)';
const COLOR_WHITE = '#ffffff';
const COLOR_BLACK = '#000000';
const COLOR_DARK = '#0A0A14';
const COLOR_PRIMARY = '#4A334B';
const COLOR_BORDER = '#F0F0F0';
const COLOR_STATUS = '#D9D9D9';

export function CreateGroupModal({ visible, onClose }: Props) {
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const searchQuery = search.trim().toLowerCase();

    const filteredContacts = useMemo(() => {
        if (!searchQuery) return MOCK_CONTACTS;
        return MOCK_CONTACTS.filter(c => {
            const nameMatch = c.name.toLowerCase().includes(searchQuery);
            const userMatch = c.username.toLowerCase().includes(searchQuery);
            return nameMatch || userMatch;
        });
    }, [searchQuery]);

    const groupedContacts = useMemo(() => {
        const groups: Record<string, typeof MOCK_CONTACTS> = {};
        filteredContacts.forEach(c => {
            const letter = c.name.charAt(0).toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(c);
        });
        const sortedKeys = Object.keys(groups).sort();
        return sortedKeys.map(key => ({ title: key, data: groups[key] }));
    }, [filteredContacts]);

    function toggleMember(id: string) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    function handleClose() {
        setSearch('');
        setSelectedIds(new Set());
        onClose();
    }

    function handleCreate() {
        if (selectedIds.size === 0) {
            Alert.alert(ERROR_TITLE, ERROR_MSG);
            return;
        }
        const msg = `${selectedIds.size}${SUCCESS_MSG_SUFFIX}`;
        Alert.alert(SUCCESS_TITLE, msg);
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
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                        <Text style={styles.closeText}>{ICON_CLOSE}</Text>
                    </TouchableOpacity>
                    <View style={styles.header}>
                        <Text style={styles.title}>{TITLE_MODAL}</Text>
                    </View>
                    <View style={styles.searchWrap}>
                        <SearchIcon />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={PLACEHOLDER_SEARCH}
                            placeholderTextColor={CHAT_COLORS.textLight}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <Text style={styles.selectedCount}>
                        {SELECTED_PREFIX}{selectedIds.size}
                    </Text>
                    <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                        {groupedContacts.map(group => (
                            <View key={group.title}>
                                <Text style={styles.groupTitle}>{group.title}</Text>
                                {group.data.map((contact, index) => {
                                    const isSelected = selectedIds.has(contact.id);
                                    const isLast = index === group.data.length - 1;
                                    return (
                                        <TouchableOpacity
                                            key={contact.id}
                                            style={[styles.memberRow, isLast && styles.memberRowLast]}
                                            onPress={() => toggleMember(contact.id)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.avatarContainer}>
                                                <Image source={{ uri: contact.avatarUri }} style={styles.avatar} />
                                                <View style={styles.statusDot} />
                                            </View>
                                            <Text style={styles.memberName}>{contact.name}</Text>
                                            <View style={styles.checkbox}>
                                                {isSelected && <Text style={styles.checkmark}>{ICON_CHECK}</Text>}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.footer}>
                        <Button type="outline" text={TXT_CANCEL} onPress={handleClose} />
                        <Button text={TXT_NEXT} onPress={handleCreate} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: COLOR_OVERLAY,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalCard: {
        width: '100%',
        maxHeight: MAX_MODAL_HEIGHT,
        backgroundColor: COLOR_WHITE,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        paddingTop: 16,
    },
    closeBtn: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    closeText: {
        fontSize: 20,
        color: COLOR_BLACK,
        fontWeight: '600',
    },
    header: {
        alignItems: 'center',
        paddingBottom: 24,
        paddingTop: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLOR_DARK,
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLOR_BORDER,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: CHAT_COLORS.text,
        padding: 0,
    },
    selectedCount: {
        fontSize: 14,
        fontWeight: '500',
        color: COLOR_DARK,
        paddingHorizontal: 20,
        marginBottom: 8,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    groupTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: COLOR_DARK,
        marginTop: 12,
        marginBottom: 4,
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLOR_BORDER,
        gap: 12,
    },
    memberRowLast: {
        borderBottomWidth: 0,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    statusDot: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: COLOR_STATUS,
        borderWidth: 2,
        borderColor: COLOR_WHITE,
    },
    memberName: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: COLOR_DARK,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLOR_PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: COLOR_PRIMARY,
        fontSize: 16,
        fontWeight: '800',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        padding: 20,
    },
});