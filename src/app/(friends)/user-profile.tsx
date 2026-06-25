import { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Button, Icon } from '@/shared/ui';
import {
    useGetPublicProfileQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useAcceptFriendMutation,
    useRemoveFriendMutation,
    useSendFriendRequestMutation,
    useRejectFriendRequestMutation,
} from '@/modules/friends';
import { useCreateChatMutation, useGetChatsQuery } from '@/modules/chat/api';


function HeartIcon() {
    return (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="#81818D"
                strokeWidth="1.5"
                fill="none"
            />
        </Svg>
    );
}

function EyeIcon() {
    return (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke="#81818D"
                strokeWidth="1.5"
                fill="none"
            />
            <Circle cx="12" cy="12" r="3" stroke="#81818D" strokeWidth="1.5" fill="none" />
        </Svg>
    );
}

const BASE_IP = '10.0.2.2';
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${BASE_IP}:3000`;

const DEFAULT_AVATAR = 'https://g-issues.com/wp-content/uploads/2019/08/default-avatar.png';

export function buildMediaUri(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('file')) return path;
    if (path.startsWith('/media')) return `${BASE_URL}${path}`;
    return `${BASE_URL}/media/thumbnail/${path}`;
}

function stripTrailingTags(content: string): string {
    return content.replace(/(\n(#\S+\s*)+)+$/, '').trim();
}

function AlbumIcon() {
    return (
        <Svg width="19" height="19" viewBox="0 0 19 19" fill="none">
            <Path d="M0.833984 4.16659C0.833984 3.28253 1.18517 2.43468 1.8103 1.80956C2.43542 1.18444 3.28326 0.833252 4.16732 0.833252H14.1673C15.0514 0.833252 15.8992 1.18444 16.5243 1.80956C17.1495 2.43468 17.5007 3.28253 17.5007 4.16659V14.1666C17.5007 15.0506 17.1495 15.8985 16.5243 16.5236C15.8992 17.1487 15.0514 17.4999 14.1673 17.4999H4.16732C3.28326 17.4999 2.43542 17.1487 1.8103 16.5236C1.18517 15.8985 0.833984 15.0506 0.833984 14.1666V4.16659Z" stroke="#81818D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M6.2513 8.33317C7.4019 8.33317 8.33464 7.40043 8.33464 6.24984C8.33464 5.09924 7.4019 4.1665 6.2513 4.1665C5.10071 4.1665 4.16797 5.09924 4.16797 6.24984C4.16797 7.40043 5.10071 8.33317 6.2513 8.33317Z" stroke="#81818D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
            <Path d="M11.273 9.68409L4.16797 17.4999H14.2788C15.1335 17.4999 15.9531 17.1604 16.5575 16.5561C17.1618 15.9517 17.5013 15.1321 17.5013 14.2774V14.1666C17.5013 13.7783 17.3555 13.6291 17.093 13.3416L13.7346 9.67909C13.5781 9.50835 13.3877 9.37211 13.1756 9.27907C12.9635 9.18602 12.7343 9.1382 12.5027 9.13868C12.2711 9.13915 12.0421 9.18789 11.8304 9.2818C11.6186 9.37571 11.4288 9.51272 11.273 9.68409Z" stroke="#81818D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
        </Svg>
    );
}

type RelationStatus = 'none' | 'request_received' | 'friend';

export default function UserProfileScreen() {
    const params = useLocalSearchParams<{
        profileId: string;
        name: string;
        username: string;
        avatarUrl: string;
        mode: string;
    }>();

    const profileId = Number(params.profileId);
    const incomingMode = params.mode as 'request' | 'recommendation' | 'friend' | undefined;

    const [confirmVisible, setConfirmVisible] = useState(false);

    const { data, isLoading, isError } = useGetPublicProfileQuery(profileId, {
        skip: !profileId || isNaN(profileId),
    });

    console.log('PUBLIC PROFILE', JSON.stringify(data, null, 2));

    const { data: friendsData = [] } = useGetFriendsQuery();
    const { data: requestsData = [] } = useGetFriendRequestsQuery();

    const [acceptFriend] = useAcceptFriendMutation();
    const [removeFriend] = useRemoveFriendMutation();
    const [sendFriendRequest] = useSendFriendRequestMutation();
    const [rejectFriendRequest] = useRejectFriendRequestMutation();
    const [createChat] = useCreateChatMutation();
    const { data: existingChats = [] } = useGetChatsQuery();

    const displayName = data?.profile.pseudonym || params.name     || 'Користувач';
    const displayUsername = data?.profile.username  || params.username || 'user';
    const avatarUri = buildMediaUri(data?.profile.profileImage) ?? params.avatarUrl ?? DEFAULT_AVATAR;

    const isFriend = friendsData.some(f => f.contactProfile.id === profileId);
    const hasPendingRequest = requestsData.some(r => r.sender.id === profileId);

    let relationStatus: RelationStatus = 'none';
    if (isFriend)                                                             relationStatus = 'friend';
    else if (hasPendingRequest || incomingMode === 'request') relationStatus = 'request_received';

    async function handleOpenChat() {
        try {
            const targetUserId = data?.profile.userId;
            if (!targetUserId) return;
            const existingChat = existingChats.find(c =>
                !c.isGroup && c.users.some(u => u.id === targetUserId),
            );
            const chat = existingChat
                ? existingChat
                : await createChat({ memberIds: [targetUserId] }).unwrap();
            router.push({
                pathname: '/(chat)/conversation/[id]',
                params: { id: String(chat.id), title: displayName, avatarUri: avatarUri ?? '' },
            });
        } catch (e) {
            console.warn('[UserProfile] handleOpenChat error:', e);
        }
    }

    async function handlePrimaryAction() {
        try {
            if (relationStatus === 'friend') { await handleOpenChat(); return; }
            if (relationStatus === 'request_received') {
                await acceptFriend({ senderProfileId: profileId }).unwrap();
            } else {
                await sendFriendRequest({ receiverProfileId: profileId }).unwrap();
            }
            router.back();
        } catch (e) {
            console.warn('[UserProfile] primaryAction error:', e);
        }
    }

    async function handleSecondaryAction() {
        try {
            if (relationStatus === 'request_received') {
                await rejectFriendRequest({ senderProfileId: profileId }).unwrap();
                router.back();
            } else if (relationStatus === 'friend') { 
                setConfirmVisible(true);
            } else {
                router.back();
            }
        } catch (e) {
            console.warn('[UserProfile] secondaryAction error:', e);
        }
    }

    async function handleConfirmRemove() {
        try {
            setConfirmVisible(false);
            await removeFriend({ contactProfileId: profileId }).unwrap();
            router.back();
        } catch (e) {
            console.warn('[UserProfile] confirmRemove error:', e);
        }
    }

    const primaryLabel: string =
        relationStatus === 'request_received' ? 'Підтвердити'  :
        relationStatus === 'friend' ? 'Повідомлення' : 'Додати';

    const secondaryLabel: string =
        relationStatus === 'request_received' ? 'Відхилити' :
        relationStatus === 'friend' ? 'Видалити'  : 'Назад';

    const hasAlbums   = (data?.albums.length ?? 0) > 0;
    const hasLastPost = !isLoading && data?.lastPost;

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>‹</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrap}>
                        <Image
                            source={{ uri: avatarUri }}
                            style={styles.avatar}
                            defaultSource={{ uri: DEFAULT_AVATAR }}
                        />
                        <View style={styles.onlineDot} />
                    </View>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.username}>@{displayUsername}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>{data?.albums?.length ?? '–'}</Text>
                            <Text style={styles.statLabel}>Альбоми</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>–</Text>
                            <Text style={styles.statLabel}>Читачі</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>–</Text>
                            <Text style={styles.statLabel}>Друзі</Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <Button text={primaryLabel} onPress={handlePrimaryAction} />
                        <Button
                            type="outline"
                            text={secondaryLabel}
                            onPress={handleSecondaryAction}
                        />
                    </View>
                </View>

                {isLoading && (
                    <View style={styles.card}>
                        <ActivityIndicator size="large" color="#543C52" />
                    </View>
                )}

                {!isLoading && hasAlbums && (
                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionLeft}>
                                <AlbumIcon />
                                <Text style={styles.sectionTitle}>Альбоми</Text>
                            </View>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>Дивитись всі</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.separator} />
                        {data!.albums.slice(0, 1).map(album => {
                            const imageUri = album.images[0]
                                ? buildMediaUri(album.images[0].image)
                                : null;
                            return (
                                <View key={album.id} style={styles.albumBlock}>
                                    <Text style={styles.albumName}>{album.name}</Text>
                                    <View style={styles.albumMeta}>
                                        <Text style={styles.albumTopic}>{album.theme}</Text>
                                        <Text style={styles.albumYear}>{album.year} рік</Text>
                                    </View>
                                    {imageUri && (
                                        <Image
                                            source={{ uri: imageUri }}
                                            style={styles.albumImage}
                                            resizeMode="cover"
                                        />
                                    )}
                                </View>
                            );
                        })}
                    </View>
                )}

                {hasLastPost && (
                    <View style={styles.card}>
                        <View style={styles.postHeader}>
                            <View style={styles.postAvatarWrap}>
                                <Image
                                    source={{ uri: avatarUri }}
                                    style={styles.postAvatar}
                                    defaultSource={{ uri: DEFAULT_AVATAR }}
                                />
                                <View style={styles.postOnlineDot} />
                            </View>
                            <Text style={styles.postName}>{displayName}</Text>
                        </View>
                        <View style={styles.separator} />
                        <Text style={styles.postTitle}>{data!.lastPost!.title}</Text>
                        <Text style={styles.postContent}>
                            {stripTrailingTags(data!.lastPost!.content)}
                        </Text>
                        {data!.lastPost!.tags.length > 0 && (
                            <View style={styles.tagsRow}>
                                {data!.lastPost!.tags.map(t => (
                                    <View key={t.id} style={styles.tagChip}>
                                        <Text style={styles.tagChipText}>
                                            {t.name.startsWith('#') ? t.name : `#${t.name}`}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {data!.lastPost!.media && data!.lastPost!.media.length > 0 && (
                            <View style={styles.mediaContainer}>
                                {data!.lastPost!.media.map(m => (
                                    <Image
                                        key={m.id}
                                        source={{ uri: m.url }}
                                        style={styles.postMedia}
                                        resizeMode="cover"
                                    />
                                ))}
                            </View>
                        )}
                        <View style={styles.postStats}>
                            <View style={styles.statChip}>
                                <HeartIcon />
                                <Text style={styles.statChipText}>{data!.lastPost!.likes} Вподобань</Text>
                            </View>
                            <View style={styles.statChip}>
                                <EyeIcon />
                                <Text style={styles.statChipText}>{data!.lastPost!.views} Переглядів</Text>
                            </View>
                        </View>
                    </View>
                )}

                {!isLoading && !isError && !data?.lastPost && !hasAlbums && (
                    <View style={[styles.card, { alignItems: 'center', paddingVertical: 30 }]}>
                        <Text style={{ color: '#999', fontSize: 14 }}>Публікацій ще немає</Text>
                    </View>
                )}
            </ScrollView>

            <Modal
                visible={confirmVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmVisible(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setConfirmVisible(false)}>
                    <Pressable style={styles.dialog} onPress={() => {}}>
                        <Text style={styles.dialogTitle}>Підтвердити дію</Text>
                        <Text style={styles.dialogText}>Ви дійсно хочете видалити користувача?</Text>
                        <View style={styles.dialogActions}>
                            <TouchableOpacity
                                style={styles.dialogBtnOutline}
                                onPress={() => setConfirmVisible(false)}
                            >
                                <Text style={styles.dialogBtnOutlineText}>Скасувати</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dialogBtnFill}
                                onPress={handleConfirmRemove}
                            >
                                <Text style={styles.dialogBtnFillText}>Підтвердити</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
    backBtn: { width: 40 },
    backArrow: { fontSize: 32, color: '#1A1A1A', lineHeight: 36 },
    scroll: { paddingBottom: 40, gap: 12 },
    profileCard: {
        backgroundColor: '#fff',
        paddingVertical: 36,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        paddingVertical: 20,
        paddingHorizontal: 16,
    },
    avatarWrap: { position: 'relative', alignSelf: 'center', marginBottom: 12 },
    avatar: { width: 96, height: 96, borderRadius: 48 },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width:  18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#D0D0D0',
        borderWidth: 2,
        borderColor: '#fff',
    },
    name: { fontSize: 24, fontWeight: '700', color: '#070A1C', textAlign: 'center', letterSpacing: -0.24 },
    username: { fontSize: 16, fontWeight: '500', color: '#070A1C', textAlign: 'center', marginTop: 4 },
    statsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 4 },
    statItem: { alignItems: 'center', paddingHorizontal: 24 },
    statNum: { fontSize: 18, fontWeight: '700', color: '#070A1C' },
    statLabel: { fontSize: 13, fontWeight: '500', color: '#81818D', marginTop: 2 },
    statDivider: { width: 1, backgroundColor: '#EBEBEB', marginVertical: 4 },
    actions: { flexDirection: 'row', gap: 12, marginTop: 16, justifyContent: 'center' },
    btnPrimary: {
        backgroundColor: '#6B4F6A',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    btnOutline: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    btnOutlineText: { color: '#1A1A1A', fontWeight: '600', fontSize: 15 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sectionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { fontSize: 20, fontWeight: '500', color: '#81818D' },
    seeAll: { fontSize: 16, fontWeight: '500', color: '#543C52' },
    separator: { height: 1, backgroundColor: '#EBEBEB', marginBottom: 12 },
    albumBlock: { marginBottom: 16 },
    albumName: { fontSize: 16, fontWeight: '500', color: '#070A1C', marginBottom: 4 },
    albumMeta: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    albumTopic: { fontSize: 16, fontWeight: '400', color: '#070A1C' },
    albumYear: { fontSize: 16, fontWeight: '400', color: '#81818D' },
    albumImage: { width: '100%', height: 180, borderRadius: 12 },
    postHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    postAvatarWrap: { position: 'relative' },
    postAvatar: { width: 46, height: 46, borderRadius: 23 },
    postOnlineDot: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#D0D0D0',
        borderWidth: 2,
        borderColor: '#fff',
    },
    postName: { fontSize: 15, fontWeight: '400', color: '#070A1C' },
    postTitle: { fontSize: 16, fontWeight: '700', color: '#070A1C', marginBottom: 4 },
    postContent: { fontSize: 15, color: '#070A1C', lineHeight: 22, marginBottom: 6 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    tagChip: { paddingHorizontal: 2, paddingVertical: 2 },
    tagChipText: { fontSize: 16, fontWeight: '400', color: '#543C52' },
    mediaContainer: { gap: 8, marginBottom: 12 },
    postMedia: { width: '100%', height: 200, borderRadius: 12 },
    postStats: { flexDirection: 'row', gap: 20, marginTop: 4 },
    statChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statChipText: { fontSize: 13, color: '#070A1C' },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    dialog: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingTop: 40,
        paddingBottom: 32,
        paddingHorizontal: 32,
        width: '100%',
        gap: 0,
    },
    dialogTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#070A1C',
        textAlign: 'center',
        marginBottom: 20,
    },
    dialogText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#070A1C',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    dialogActions: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-end',
    },
    dialogBtnOutline: {
        borderWidth: 1,
        borderColor: '#543C52',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
    },
    dialogBtnOutlineText: {
        color: '#543C52',
        fontWeight: '600',
        fontSize: 14,
    },
    dialogBtnFill: {
        backgroundColor: '#543C52',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 24,
    },
    dialogBtnFillText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
