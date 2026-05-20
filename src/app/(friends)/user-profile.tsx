import React from 'react';
import {
    View, Text, Image, ScrollView, StyleSheet,
    TouchableOpacity, Pressable, ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Icon } from '@/shared/ui';
import {
    useGetPublicProfileQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useAcceptFriendMutation,
    useRemoveFriendMutation,
    useSendFriendRequestMutation,
    useRejectFriendRequestMutation,
} from '@/modules/friends';

function HeartIcon() {
    return (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="#81818D" strokeWidth="1.5" fill="none"
            />
        </Svg>
    );
}

function EyeIcon() {
    return (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#81818D" strokeWidth="1.5" fill="none" />
            <Circle cx="12" cy="12" r="3" stroke="#81818D" strokeWidth="1.5" fill="none" />
        </Svg>
    );
}

const API_MEDIA_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
const DEFAULT_AVATAR = 'https://g-issues.com/wp-content/uploads/2019/08/default-avatar.png';

function buildMediaUri(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('file')) return path;
    if (path.startsWith('/media')) return `${API_MEDIA_BASE}${path}`;
    return `${API_MEDIA_BASE}/media/thumbnail/${path}`;
}
function stripTrailingTags(content: string): string {
    return content.replace(/(\n(#\S+\s*)+)+$/, '').trim();
}

type RelationStatus = 'none' | 'request_received' | 'friend';

export default function UserProfileScreen() {
    const params = useLocalSearchParams<{
        profileId: string;
        name:      string;
        username:  string;
        avatarUrl: string;
        mode:      string;
    }>();

    const profileId    = Number(params.profileId);
    const incomingMode = params.mode as 'request' | 'recommendation' | 'friend' | undefined;

    const { data, isLoading, isError } = useGetPublicProfileQuery(profileId, {
        skip: !profileId || isNaN(profileId),
    });

    const { data: friendsData  = [] } = useGetFriendsQuery();
    const { data: requestsData = [] } = useGetFriendRequestsQuery();

    const [acceptFriend]        = useAcceptFriendMutation();
    const [removeFriend]        = useRemoveFriendMutation();
    const [sendFriendRequest]   = useSendFriendRequestMutation();
    const [rejectFriendRequest] = useRejectFriendRequestMutation();

    const displayName     = data?.profile.pseudonym || params.name     || 'Користувач';
    const displayUsername = data?.profile.username  || params.username || 'user';
    const avatarUri       = buildMediaUri(data?.profile.profileImage) ?? params.avatarUrl ?? DEFAULT_AVATAR;

    const isFriend          = friendsData.some(f => f.contactProfile.id === profileId);
    const hasPendingRequest = requestsData.some(r => r.sender.id === profileId);

    let relationStatus: RelationStatus = 'none';
    if (isFriend)                                              relationStatus = 'friend';
    else if (hasPendingRequest || incomingMode === 'request')  relationStatus = 'request_received';

    async function handlePrimaryAction() {
        try {
            if (relationStatus === 'request_received') {
                await acceptFriend({ senderProfileId: profileId }).unwrap();
                router.back();
            } else if (relationStatus === 'none') {
                await sendFriendRequest({ receiverProfileId: profileId }).unwrap();
                router.back();
            }
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
                await removeFriend({ contactProfileId: profileId }).unwrap();
                router.back();
            } else {
                router.back();
            }
        } catch (e) {
            console.warn('[UserProfile] secondaryAction error:', e);
        }
    }

    const primaryLabel: string =
        relationStatus === 'request_received' ? 'Підтвердити'  :
        relationStatus === 'friend'           ? 'Повідомлення' :
                                                'Додати';

    const secondaryLabel: string =
        relationStatus === 'request_received' ? 'Відхилити' :
        relationStatus === 'friend'           ? 'Видалити'  :
                                                'Назад';

    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backArrow}>‹</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>

                <View style={styles.card}>
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
                            <Text style={styles.statNum}>{data?.albums.length ?? '–'}</Text>
                            <Text style={styles.statLabel}>Альбоми</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>–</Text>
                            <Text style={styles.statLabel}>Читачі</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>–</Text>
                            <Text style={styles.statLabel}>Друзі</Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.btnPrimary} onPress={handlePrimaryAction}>
                            <Text style={styles.btnPrimaryText}>{primaryLabel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnOutline} onPress={handleSecondaryAction}>
                            <Text style={styles.btnOutlineText}>{secondaryLabel}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {isLoading && (
                    <View style={styles.card}>
                        <ActivityIndicator size="large" color="#543C52" />
                    </View>
                )}

                {!isLoading && (data?.albums.length ?? 0) > 0 && (
                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Icon name="img" size={17} />
                            <Text style={styles.sectionTitle}>Альбоми</Text>
                        </View>
                        <View style={styles.separator} />

                        {data!.albums.map(album => {
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

                {!isLoading && data?.lastPost && (
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

                        <Text style={styles.postTitle}>{data.lastPost.title}</Text>

                        <Text style={styles.postContent}>
                            {stripTrailingTags(data.lastPost.content)}
                        </Text>

                        {data.lastPost.tags.length > 0 && (
                            <View style={styles.tagsRow}>
                                {data.lastPost.tags.map(t => (
                                    <View key={t.id} style={styles.tagChip}>
                                        <Text style={styles.tagChipText}>
                                            {t.name.startsWith('#') ? t.name : `#${t.name}`}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {data.lastPost.media && data.lastPost.media.length > 0 && (
                            <View style={styles.mediaContainer}>
                                {data.lastPost.media.map(m => (
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
                                <Text style={styles.statChipText}>{data.lastPost.likes} Вподобань</Text>
                            </View>
                            <View style={styles.statChip}>
                                <EyeIcon />
                                <Text style={styles.statChipText}>{data.lastPost.views} Переглядів</Text>
                            </View>
                        </View>
                    </View>
                )}

                {!isLoading && !isError && !data?.lastPost && (data?.albums.length ?? 0) === 0 && (
                    <View style={[styles.card, { alignItems: 'center', paddingVertical: 30 }]}>
                        <Text style={{ color: '#999', fontSize: 14 }}>Публікацій ще немає</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen:         { flex: 1, backgroundColor: '#F3F4F6' },
    header:         { backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
    backBtn:        { width: 40 },
    backArrow:      { fontSize: 32, color: '#1A1A1A', lineHeight: 36 },
    scroll:         { paddingTop: 16, paddingBottom: 40, gap: 12 },
    card:           { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#EBEBEB', paddingVertical: 20, paddingHorizontal: 16 },
    avatarWrap:     { position: 'relative', alignSelf: 'center', marginBottom: 12 },
    avatar:         { width: 96, height: 96, borderRadius: 48 },
    onlineDot:      { position: 'absolute', bottom: 2, right: 2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#D0D0D0', borderWidth: 2, borderColor: '#fff' },
    name:           { fontSize: 24, fontWeight: '700', color: '#070A1C', textAlign: 'center', letterSpacing: -0.24 },
    username:       { fontSize: 16, fontWeight: '500', color: '#070A1C', textAlign: 'center', marginTop: 4 },
    statsRow:       { flexDirection: 'row', justifyContent: 'center', marginTop: 16, marginBottom: 4 },
    statItem:       { alignItems: 'center', paddingHorizontal: 24 },
    statNum:        { fontSize: 18, fontWeight: '700', color: '#070A1C' },
    statLabel:      { fontSize: 13, fontWeight: '500', color: '#81818D', marginTop: 2 },
    divider:        { width: 1, backgroundColor: '#EBEBEB', marginVertical: 4 },
    actions:        { flexDirection: 'row', gap: 12, marginTop: 16, justifyContent: 'center' },
    btnPrimary:     { backgroundColor: '#543C52', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
    btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    btnOutline:     { borderWidth: 1, borderColor: '#D0D0D0', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
    btnOutlineText: { color: '#1A1A1A', fontWeight: '600', fontSize: 15 },
    sectionHeader:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    sectionTitle:   { fontSize: 14, fontWeight: '500', color: '#81818D' },
    separator:      { height: 1, backgroundColor: '#EBEBEB', marginBottom: 12 },
    albumBlock:     { marginBottom: 16 },
    albumName:      { fontSize: 15, fontWeight: '500', color: '#070A1C', marginBottom: 4 },
    albumMeta:      { flexDirection: 'row', gap: 8, marginBottom: 12 },
    albumTopic:     { fontSize: 13, color: '#070A1C' },
    albumYear:      { fontSize: 13, color: '#81818D' },
    albumImage:     { width: '100%', height: 180, borderRadius: 12 },
    postHeader:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    postAvatarWrap: { position: 'relative' },
    postAvatar:     { width: 46, height: 46, borderRadius: 23 },
    postOnlineDot:  { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#D0D0D0', borderWidth: 2, borderColor: '#fff' },
    postName:       { fontSize: 15, fontWeight: '400', color: '#070A1C' },
    postTitle:      { fontSize: 16, fontWeight: '700', color: '#070A1C', marginBottom: 4 },
    postContent:    { fontSize: 15, color: '#070A1C', lineHeight: 22, marginBottom: 6 },
    tagsRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    tagChip:        { backgroundColor: '#F2EEF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    tagChipText:    { fontSize: 13, color: '#543C52', fontWeight: '500' },
    mediaContainer: { gap: 8, marginBottom: 12 },
    postMedia:      { width: '100%', height: 200, borderRadius: 12 },
    postStats:      { flexDirection: 'row', gap: 20, marginTop: 4 },
    statChip:       { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statChipText:   { fontSize: 13, color: '#070A1C' },
});