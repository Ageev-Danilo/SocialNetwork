import { useState, useMemo } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    Alert,
    Image,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '@/shared/ui';
import { SearchIcon, TrashIcon, MediaIcon } from './ChatIcons';
import { CHAT_COLORS } from './chat-theme';
import { useGetFriendsQuery } from '@/modules/friends';
import { useCreateChatMutation } from '@/modules/chat/api';

interface Props {
    visible: boolean;
    onClose: () => void;
}

const { height: SCREEN_H } = Dimensions.get('window');
const MAX_MODAL_HEIGHT = SCREEN_H * 0.9;
const BASE_IP = '10.0.2.2';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${BASE_IP}:3000`;
const COLOR_OVERLAY = 'rgba(0,0,0,0.5)';
const COLOR_WHITE = '#ffffff';
const COLOR_BLACK = '#000000';
const COLOR_DARK = '#0A0A14';
const COLOR_PRIMARY = '#543C52';
const COLOR_BORDER = '#F0F0F0';

function buildAvatarUri(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('file')) return path;
    if (path.startsWith('/media')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/media/thumbnail/${path}`;
}

function getInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return (words[0]?.slice(0, 2) ?? 'U').toUpperCase();
}

function PlusIcon() {
    return (
        <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
            <Path
                d="M14.0625 8.65383H8.65383V14.0625C8.65383 14.3494 8.53986 14.6245 8.337 14.8274C8.13414 15.0302 7.85899 15.1442 7.5721 15.1442C7.28521 15.1442 7.01007 15.0302 6.8072 14.8274C6.60434 14.6245 6.49037 14.3494 6.49037 14.0625V8.65383H1.08173C0.794837 8.65383 0.519695 8.53986 0.316831 8.337C0.113968 8.13414 0 7.859 0 7.5721C0 7.28521 0.113968 7.01007 0.316831 6.80721C0.519695 6.60434 0.794837 6.49037 1.08173 6.49037H6.49037V1.08173C6.49037 0.794837 6.60434 0.519694 6.8072 0.316831C7.01007 0.113967 7.28521 0 7.5721 0C7.85899 0 8.13414 0.113967 8.337 0.316831C8.53986 0.519694 8.65383 0.794837 8.65383 1.08173V6.49037H14.0625C14.3494 6.49037 14.6245 6.60434 14.8274 6.80721C15.0302 7.01007 15.1442 7.28521 15.1442 7.5721C15.1442 7.859 15.0302 8.13414 14.8274 8.337C14.6245 8.53986 14.3494 8.65383 14.0625 8.65383Z"
                fill={COLOR_PRIMARY}
            />
        </Svg>
    );
}

export function CreateGroupModal({ visible, onClose }: Props) {
    const [step, setStep] = useState<1 | 2>(1);
    const [search, setSearch] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupImageUri, setGroupImageUri] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const { data: friends = [], isLoading } = useGetFriendsQuery();
    const [createChat, { isLoading: isCreating }] = useCreateChatMutation();

    const searchQuery = search.trim().toLowerCase();

    const contacts = useMemo(() => {
        const mapped = friends.map(f => ({
            id: f.contactProfile.id,
            userId: f.contactProfile.userId,
            name: f.contactProfile.pseudonym || 'Користувач',
            avatarUri: buildAvatarUri(f.contactProfile.profileImage),
        }));
        if (!searchQuery) return mapped;
        return mapped.filter(c => c.name.toLowerCase().includes(searchQuery));
    }, [friends, searchQuery]);

    const groupedContacts = useMemo(() => {
        const groups: Record<string, typeof contacts> = {};
        contacts.forEach(c => {
            const letter = c.name.charAt(0).toUpperCase();
            if (!groups[letter]) groups[letter] = [];
            groups[letter].push(c);
        });
        return Object.keys(groups)
            .sort()
            .map(key => ({ title: key, data: groups[key] }));
    }, [contacts]);

    const selectedContacts = useMemo(() => {
        return friends
            .filter(f => selectedIds.has(f.contactProfile.id))
            .map(f => ({
                id: f.contactProfile.id,
                userId: f.contactProfile.userId,
                name: f.contactProfile.pseudonym || 'Користувач',
                avatarUri: buildAvatarUri(f.contactProfile.profileImage),
            }));
    }, [friends, selectedIds]);

    const avatarInitials = groupName.trim() ? getInitials(groupName.trim()) : 'NG';

    function toggleMember(id: number) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function removeMember(id: number) {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }

    function handleClose() {
        setStep(1);
        setSearch('');
        setGroupName('');
        setGroupImageUri(null);
        setSelectedIds(new Set());
        onClose();
    }

    function goToStep2() {
        if (selectedIds.size < 2) {
            Alert.alert('Помилка', 'Оберіть мінімум двох учасників');
            return;
        }
        setStep(2);
    }

    async function pickFromGallery() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) setGroupImageUri(result.assets[0].uri);
    }

    async function pickFromCamera() {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Доступ заборонено', 'Дозвольте доступ до камери в налаштуваннях');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) setGroupImageUri(result.assets[0].uri);
    }

    async function handleCreate() {
        if (!groupName.trim()) {
            Alert.alert('Помилка', 'Введіть назву групи');
            return;
        }
        const memberIds = selectedContacts
            .map(c => c.userId)
            .filter((id): id is number => id != null);
        if (memberIds.length < 2) {
            Alert.alert('Помилка', 'Не вдалося визначити учасників');
            return;
        }
        try {
            await createChat({ memberIds, isGroup: true, name: groupName.trim() }).unwrap();
            handleClose();
        } catch {
            Alert.alert('Помилка', 'Не вдалося створити групу');
        }
    }

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={styles.modalCard}>
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Нова група</Text>
                    </View>

                    {step === 1 ? (
                        <>
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
                            <ScrollView
                                style={styles.scrollContent}
                                keyboardShouldPersistTaps="handled"
                            >
                                {isLoading ? (
                                    <ActivityIndicator
                                        color={CHAT_COLORS.primary}
                                        style={styles.loader}
                                    />
                                ) : contacts.length === 0 ? (
                                    <Text style={styles.emptyText}>Список контактів порожній</Text>
                                ) : (
                                    <View>
                                        {groupedContacts.map(group => (
                                            <View key={group.title}>
                                                <Text style={styles.groupTitle}>{group.title}</Text>
                                                {group.data.map((contact, index) => {
                                                    const isSelected = selectedIds.has(contact.id);
                                                    const isLast = index === group.data.length - 1;
                                                    const initials = getInitials(contact.name);
                                                    return (
                                                        <TouchableOpacity
                                                            key={contact.id}
                                                            style={[
                                                                styles.memberRow,
                                                                isLast && styles.memberRowLast,
                                                            ]}
                                                            onPress={() => toggleMember(contact.id)}
                                                            activeOpacity={0.7}
                                                        >
                                                            {contact.avatarUri ? (
                                                                <Image
                                                                    source={{
                                                                        uri: contact.avatarUri,
                                                                    }}
                                                                    style={styles.avatar}
                                                                />
                                                            ) : (
                                                                <View
                                                                    style={[
                                                                        styles.avatar,
                                                                        styles.avatarFallback,
                                                                    ]}
                                                                >
                                                                    <Text
                                                                        style={
                                                                            styles.avatarInitials
                                                                        }
                                                                    >
                                                                        {initials}
                                                                    </Text>
                                                                </View>
                                                            )}
                                                            <View style={styles.nameBlock}>
                                                                <Text style={styles.memberName}>
                                                                    {contact.name}
                                                                </Text>
                                                            </View>
                                                            <View
                                                                style={[
                                                                    styles.checkbox,
                                                                    isSelected &&
                                                                        styles.checkboxSelected,
                                                                ]}
                                                            >
                                                                {isSelected && (
                                                                    <Text style={styles.checkmark}>
                                                                        ✓
                                                                    </Text>
                                                                )}
                                                            </View>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </ScrollView>
                            <View style={styles.footer}>
                                <Button type="outline" text="Скасувати" onPress={handleClose} />
                                <Button type="fill" text="Далі" onPress={goToStep2} />
                            </View>
                        </>
                    ) : (
                        <>
                            <ScrollView
                                style={styles.scrollContent}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.nameSection}>
                                    <Text style={styles.fieldLabel}>Назва</Text>
                                    <TextInput
                                        style={styles.nameInput}
                                        placeholder="Введіть назву"
                                        placeholderTextColor={CHAT_COLORS.textLight}
                                        value={groupName}
                                        onChangeText={setGroupName}
                                        autoFocus
                                    />
                                </View>

                                <View style={styles.avatarSection}>
                                    {groupImageUri ? (
                                        <Image
                                            source={{ uri: groupImageUri }}
                                            style={styles.groupAvatar}
                                        />
                                    ) : (
                                        <View style={styles.groupAvatarFallback}>
                                            <Text style={styles.groupAvatarInitials}>
                                                {avatarInitials}
                                            </Text>
                                        </View>
                                    )}
                                    <View style={styles.photoRow}>
                                        <TouchableOpacity
                                            style={styles.photoBtn}
                                            onPress={pickFromCamera}
                                        >
                                            <PlusIcon />
                                            <Text style={styles.photoBtnText}>Додайте фото</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.photoBtn}
                                            onPress={pickFromGallery}
                                        >
                                            <MediaIcon size={16} color={COLOR_PRIMARY} />
                                            <Text style={styles.photoBtnText}>Оберіть фото</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={styles.participantsLabel}>Учасники</Text>
                                {selectedContacts.map(contact => {
                                    const initials = getInitials(contact.name);
                                    return (
                                        <View key={contact.id} style={styles.participantRow}>
                                            {contact.avatarUri ? (
                                                <Image
                                                    source={{ uri: contact.avatarUri }}
                                                    style={styles.avatar}
                                                />
                                            ) : (
                                                <View
                                                    style={[styles.avatar, styles.avatarFallback]}
                                                >
                                                    <Text style={styles.avatarInitials}>
                                                        {initials}
                                                    </Text>
                                                </View>
                                            )}
                                            <Text style={styles.participantName}>
                                                {contact.name}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => removeMember(contact.id)}
                                                style={styles.removeBtn}
                                            >
                                                <TrashIcon size={18} color={COLOR_DARK} />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })}
                            </ScrollView>
                            <View style={styles.footer}>
                                <Button type="outline" text="Назад" onPress={() => setStep(1)} />
                                <Button
                                    type="fill"
                                    text={isCreating ? 'Створення...' : 'Створити групу'}
                                    onPress={handleCreate}
                                />
                            </View>
                        </>
                    )}
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
    closeText: { fontSize: 20, color: COLOR_BLACK, fontWeight: '600' },
    header: { alignItems: 'center', paddingBottom: 20, paddingTop: 12 },
    title: {
        fontSize: 24,
        fontWeight: '500',
        color: '#070A1C',
        letterSpacing: -0.24,
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLOR_BORDER,
        gap: 10,
    },
    searchInput: { flex: 1, fontSize: 15, color: CHAT_COLORS.text, padding: 0 },
    selectedCount: { fontSize: 14, color: COLOR_DARK, paddingHorizontal: 20, marginBottom: 8 },
    scrollContent: { paddingHorizontal: 20 },
    loader: { paddingVertical: 40 },
    emptyText: {
        textAlign: 'center',
        color: CHAT_COLORS.textMuted,
        fontSize: 14,
        paddingVertical: 30,
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
    memberRowLast: { borderBottomWidth: 0 },
    avatar: { width: 44, height: 44, borderRadius: 22 },
    avatarFallback: {
        backgroundColor: COLOR_PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: { fontSize: 14, fontWeight: '700', color: COLOR_WHITE },
    nameBlock: { flex: 1 },
    memberName: { fontSize: 16, fontWeight: '600', color: COLOR_DARK },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLOR_PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: { backgroundColor: COLOR_PRIMARY },
    checkmark: { color: COLOR_WHITE, fontSize: 16, fontWeight: '800' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        padding: 20,
    },
    nameSection: { gap: 8, marginBottom: 20 },
    fieldLabel: { fontSize: 14, fontWeight: '400', color: COLOR_DARK },
    nameInput: {
        borderWidth: 1,
        borderColor: COLOR_BORDER,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: CHAT_COLORS.text,
    },
    avatarSection: { alignItems: 'center', marginBottom: 20, gap: 12 },
    groupAvatar: { width: 46, height: 46, borderRadius: 23 },
    groupAvatarFallback: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: COLOR_PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupAvatarInitials: { fontSize: 18, fontWeight: '700', color: COLOR_WHITE },
    photoRow: { flexDirection: 'row', gap: 16 },
    photoBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 0,
    },
    photoBtnText: { fontSize: 13, fontWeight: '500', color: COLOR_PRIMARY },
    participantsLabel: {
        fontSize: 14,
        fontWeight: '400',
        color: COLOR_DARK,
        marginBottom: 8,
        marginTop: 4,
    },
    participantRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 12,
    },
    participantName: { flex: 1, fontSize: 16, fontWeight: '600', color: COLOR_DARK },
    removeBtn: { padding: 6 },
});
