import { useState, useMemo } from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, Dimensions, ScrollView, Alert, Image, TextInput, ActivityIndicator } from 'react-native';
import { Button } from '@/shared/ui';
import { SearchIcon } from './ChatIcons';
import { CHAT_COLORS } from './chat-theme';
import { useGetFriendsQuery } from '@/modules/friends';
import { useCreateChatMutation } from '@/modules/chat/api';


interface Props {
    visible: boolean;
    onClose: () => void;
}

const { height: SCREEN_H }  = Dimensions.get('window');
const MAX_MODAL_HEIGHT       = SCREEN_H * 0.9;
const BASE_URL               = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';

function buildAvatarUri(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('file')) return path;
    if (path.startsWith('/media')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/media/thumbnail/${path}`;
}

export function CreateGroupModal({ visible, onClose }: Props) {
    const [search, setSearch]         = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const { data: friends = [], isLoading } = useGetFriendsQuery();
    const [createChat, { isLoading: isCreating }] = useCreateChatMutation();

    const searchQuery = search.trim().toLowerCase();

    const contacts = useMemo(() => {
        const mapped = friends.map(f => ({
            id:        f.contactProfile.id,
            userId:    f.contactProfile.userId,
            name:      f.contactProfile.pseudonym || f.contactProfile.username || 'Користувач',
            username:  f.contactProfile.username,
            avatarUri: buildAvatarUri(f.contactProfile.profileImage),
        }));
        if (!searchQuery) return mapped;
        return mapped.filter(c =>
            c.name.toLowerCase().includes(searchQuery) ||
            (c.username ?? '').toLowerCase().includes(searchQuery),
        );
    }, [friends, searchQuery]);

    const groupedContacts = useMemo(() => {
        const groups: Record<string, typeof contacts> = {};
        contacts.forEach(c => {
            const letter = c.name.charAt(0).toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(c);
        });
        return Object.keys(groups).sort().map(key => ({ title: key, data: groups[key] }));
    }, [contacts]);

    function toggleMember(id: number) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function handleClose() {
        setSearch('');
        setSelectedIds(new Set());
        onClose();
    }

    async function handleCreate() {
        if (selectedIds.size === 0) {
            Alert.alert('Помилка', 'Оберіть хоча б одного учасника');
            return;
        }

        const selectedFriends = friends.filter(f => selectedIds.has(f.contactProfile.id));
        const memberIds = selectedFriends
            .map(f => f.contactProfile.userId)
            .filter((id): id is number => id != null);

        if (memberIds.length === 0) {
            Alert.alert('Помилка', 'Не вдалося визначити учасників');
            return;
        }

        try {
            await createChat({ memberIds, isGroup: true }).unwrap();
            Alert.alert('Групу створено', `${selectedIds.size} учасників`);
            handleClose();
        } catch (e) {
            console.warn('createChat error:', e);
            Alert.alert('Помилка', 'Не вдалося створити групу');
        }
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
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                    <View style={styles.header}>
                        <Text style={styles.title}>Нова група</Text>
                    </View>
                    <View style={styles.searchWrap}>
                        <SearchIcon />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Пошук"
                            placeholderTextColor={CHAT_COLORS.textLight}
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                    <Text style={styles.selectedCount}>Вибрано: {selectedIds.size}</Text>
                    <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
                        {isLoading ? (
                            <ActivityIndicator color={CHAT_COLORS.primary} style={styles.loader} />
                        ) : contacts.length === 0 ? (
                            <Text style={styles.emptyText}>Список контактів порожній</Text>
                        ) : (
                            groupedContacts.map(group => (
                                <View key={group.title}>
                                    <Text style={styles.groupTitle}>{group.title}</Text>
                                    {group.data.map((contact, index) => {
                                        const isSelected = selectedIds.has(contact.id);
                                        const isLast     = index === group.data.length - 1;
                                        const initials   = contact.name.slice(0, 2).toUpperCase();
                                        return (
                                            <TouchableOpacity
                                                key={contact.id}
                                                style={[styles.memberRow, isLast && styles.memberRowLast]}
                                                onPress={() => toggleMember(contact.id)}
                                                activeOpacity={0.7}
                                            >
                                                <View style={styles.avatarContainer}>
                                                    {contact.avatarUri ? (
                                                        <Image source={{ uri: contact.avatarUri }} style={styles.avatar} />
                                                    ) : (
                                                        <View style={[styles.avatar, styles.avatarFallback]}>
                                                            <Text style={styles.avatarInitials}>{initials}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <View style={styles.nameBlock}>
                                                    <Text style={styles.memberName}>{contact.name}</Text>
                                                    {contact.username ? (
                                                        <Text style={styles.memberUsername}>@{contact.username}</Text>
                                                    ) : null}
                                                </View>
                                                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                                                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ))
                        )}
                    </ScrollView>
                    <View style={styles.footer}>
                        <Button type="outline" text="Скасувати" onPress={handleClose} />
                        <Button
                            type="fill"
                            text={isCreating ? 'Створення...' : 'Далі'}
                            onPress={handleCreate}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const COLOR_OVERLAY  = 'rgba(0,0,0,0.5)';
const COLOR_WHITE    = '#ffffff';
const COLOR_BLACK    = '#000000';
const COLOR_DARK     = '#0A0A14';
const COLOR_PRIMARY  = '#4A334B';
const COLOR_BORDER   = '#F0F0F0';

const styles = StyleSheet.create({
    overlay: {
        flex:            1,
        backgroundColor: COLOR_OVERLAY,
        justifyContent:  'center',
        alignItems:      'center',
        padding:         20,
    },
    modalCard: {
        width:           '100%',
        maxHeight:       MAX_MODAL_HEIGHT,
        backgroundColor: COLOR_WHITE,
        borderRadius:    24,
        overflow:        'hidden',
        position:        'relative',
        paddingTop:      16,
    },
    closeBtn: {
        position:       'absolute',
        top:            20,
        right:          20,
        width:          32,
        height:         32,
        justifyContent: 'center',
        alignItems:     'center',
        zIndex:         10,
    },
    closeText:     { fontSize: 20, color: COLOR_BLACK, fontWeight: '600' },
    header:        { alignItems: 'center', paddingBottom: 24, paddingTop: 12 },
    title:         { fontSize: 24, fontWeight: '700', color: COLOR_DARK },
    searchWrap: {
        flexDirection:     'row',
        alignItems:        'center',
        marginHorizontal:  20,
        marginBottom:      16,
        paddingHorizontal: 14,
        paddingVertical:   10,
        borderRadius:      12,
        borderWidth:       1,
        borderColor:       COLOR_BORDER,
        gap:               10,
    },
    searchInput:    { flex: 1, fontSize: 15, color: CHAT_COLORS.text, padding: 0 },
    selectedCount:  { fontSize: 14, fontWeight: '500', color: COLOR_DARK, paddingHorizontal: 20, marginBottom: 8 },
    content:        { paddingHorizontal: 20, paddingBottom: 12 },
    loader:         { paddingVertical: 40 },
    emptyText:      { textAlign: 'center', color: CHAT_COLORS.textMuted, fontSize: 14, paddingVertical: 30 },
    groupTitle:     { fontSize: 12, fontWeight: '700', color: COLOR_DARK, marginTop: 12, marginBottom: 4 },
    memberRow: {
        flexDirection:     'row',
        alignItems:        'center',
        paddingVertical:   12,
        borderBottomWidth: 1,
        borderBottomColor: COLOR_BORDER,
        gap:               12,
    },
    memberRowLast:   { borderBottomWidth: 0 },
    avatarContainer: { position: 'relative' },
    avatar:          { width: 44, height: 44, borderRadius: 22 },
    avatarFallback: {
        backgroundColor: CHAT_COLORS.highlight,
        justifyContent:  'center',
        alignItems:      'center',
    },
    avatarInitials:  { fontSize: 14, fontWeight: '700', color: COLOR_PRIMARY },
    nameBlock:       { flex: 1 },
    memberName:      { fontSize: 16, fontWeight: '600', color: COLOR_DARK },
    memberUsername:  { fontSize: 13, color: CHAT_COLORS.textMuted, marginTop: 2 },
    checkbox: {
        width:          24,
        height:         24,
        borderRadius:   6,
        borderWidth:    2,
        borderColor:    COLOR_PRIMARY,
        justifyContent: 'center',
        alignItems:     'center',
    },
    checkboxSelected: { backgroundColor: COLOR_PRIMARY },
    checkmark:        { color: COLOR_WHITE, fontSize: 16, fontWeight: '800' },
    footer: {
        flexDirection:  'row',
        justifyContent: 'flex-end',
        gap:            12,
        padding:        20,
    },
});