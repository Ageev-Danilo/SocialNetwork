import {
    View, Text, Image, ScrollView,
    StyleSheet, TouchableOpacity, Pressable,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Icon } from '@/shared/ui';
import { MOCK_REQUESTS } from '@/modules/friends';
import {
    useAddFriendMutation,
    useRemoveFriendMutation,
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
            <Path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke="#81818D" strokeWidth="1.5" fill="none"
            />
            <Circle cx="12" cy="12" r="3" stroke="#81818D" strokeWidth="1.5" fill="none" />
        </Svg>
    );
}

const MOCK_LAST_POST = {
    content: 'adadadadadadadadadadadadadadadadadadadadadadadad ',
    tags:    '#вайб',
    likes:   120,
    views:   890,
    album: {
        title: 'Настрій',
        topic: 'Природа',
        year:  '2025 рік',
        image: { uri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
    },
};

export default function UserProfileScreen() {
    const { userId } = useLocalSearchParams<{ userId: string }>();

    const user = MOCK_REQUESTS.find(u => String(u.id) === userId) ?? MOCK_REQUESTS[0];

    const [addFriend]    = useAddFriendMutation();
    const [removeFriend] = useRemoveFriendMutation();

    async function handleConfirm() {
        const payload = {
            profile: {
                id:           user.id,
                userId:       user.id,
                pseudonym:    user.username,
                firstName:    user.name.split(' ')[0] ?? '',
                lastName:     user.name.split(' ')[1] ?? '',
                date:         '',
                username:     user.username,
                signature:    null,
                profileImage: null,
            },
        };
        console.log('[UserProfile] → addFriend payload:', JSON.stringify(payload));

        try {
            const result = await addFriend(payload).unwrap();
            console.log('[UserProfile] addFriend success:', result);
            router.back();
        } catch (e) {
            console.log('[UserProfile] addFriend error (бекенд не готовий):', e);
        }
    }

    async function handleRemove() {
        const payload = {
            profile: {
                id:           user.id,
                userId:       user.id,
                pseudonym:    user.username,
                firstName:    user.name.split(' ')[0] ?? '',
                lastName:     user.name.split(' ')[1] ?? '',
                date:         '',
                username:     user.username,
                signature:    null,
                profileImage: null,
            },
        };
        console.log('[UserProfile] → removeFriend payload:', JSON.stringify(payload));

        try {
            const result = await removeFriend(payload).unwrap();
            console.log('[UserProfile] removeFriend success:', result);
            router.back();
        } catch (e) {
            console.log('[UserProfile] removeFriend error (бекенд не готовий):', e);
        }
    }

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
                        <Image source={user.avatar} style={styles.avatar} />
                        <View style={styles.onlineDot} />
                    </View>

                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.username}>@{user.username}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>3</Text>
                            <Text style={styles.statLabel}>Дописи</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>12.1K</Text>
                            <Text style={styles.statLabel}>Читачі</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNum}>222</Text>
                            <Text style={styles.statLabel}>Друзі</Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.btnPrimary} onPress={handleConfirm}>
                            <Text style={styles.btnPrimaryText}>Підтвердити</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnOutline} onPress={handleRemove}>
                            <Text style={styles.btnOutlineText}>Видалити</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <Icon name="img" size={17} />
                        <Text style={styles.sectionTitle}>Альбоми</Text>
                        <Pressable style={{ marginLeft: 'auto' }}>
                            <Text style={styles.seeAll}>Дивитись всі</Text>
                        </Pressable>
                    </View>

                    <View style={styles.separator} />

                    <Text style={styles.albumName}>{MOCK_LAST_POST.album.title}</Text>
                    <View style={styles.albumMeta}>
                        <Text style={styles.albumTopic}>{MOCK_LAST_POST.album.topic}</Text>
                        <Text style={styles.albumYear}>{MOCK_LAST_POST.album.year}</Text>
                    </View>

                    <Image
                        source={MOCK_LAST_POST.album.image}
                        style={styles.albumImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.card}>
                    <View style={styles.postHeader}>
                        <View style={styles.postAvatarWrap}>
                            <Image source={user.avatar} style={styles.postAvatar} />
                            <View style={styles.postOnlineDot} />
                        </View>
                        <Text style={styles.postName}>{user.name}</Text>
                    </View>

                    <View style={styles.separator} />

                    <Text style={styles.postContent}>{MOCK_LAST_POST.content}</Text>
                    <Text style={styles.postTag}>{MOCK_LAST_POST.tags}</Text>

                    <View style={styles.postStats}>
                        <View style={styles.statChip}>
                            <HeartIcon />
                            <Text style={styles.statChipText}>{MOCK_LAST_POST.likes} Вподобань</Text>
                        </View>
                        <View style={styles.statChip}>
                            <EyeIcon />
                            <Text style={styles.statChipText}>{MOCK_LAST_POST.views} Переглядів</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        backgroundColor:   '#fff',
        paddingHorizontal: 16,
        paddingTop:        16,
        paddingBottom:     8,
    },
    backBtn: {
        width: 40,
    },
    backArrow: {
        fontSize:   32,
        color:      '#1A1A1A',
        lineHeight: 36,
    },
    scroll: {
        paddingTop:        16,
        paddingHorizontal: 0,
        paddingBottom:     40,
        gap:               12,
    },
    card: {
        backgroundColor:  '#fff',
        borderRadius:     16,
        borderWidth:      1,
        borderColor:      '#EBEBEB',
        paddingVertical:  20,
        paddingHorizontal: 16,
    },
    avatarWrap: {
        position:  'relative',
        alignSelf: 'center',
        marginBottom: 12,
    },
    avatar: {
        width:        96,
        height:       96,
        borderRadius: 48,
    },
    onlineDot: {
        position:        'absolute',
        bottom:          2,
        right:           2,
        width:           18,
        height:          18,
        borderRadius:    9,
        backgroundColor: '#D0D0D0',
        borderWidth:     2,
        borderColor:     '#fff',
    },
    name: {
        fontSize:      24,
        fontWeight:    '700',
        color:         '#070A1C',
        textAlign:     'center',
        letterSpacing: -0.24,
    },
    username: {
        fontSize:   16,
        fontWeight: '500',
        color:      '#070A1C',
        textAlign:  'center',
        marginTop:  4,
    },
    statsRow: {
        flexDirection:  'row',
        justifyContent: 'center',
        marginTop:      16,
        marginBottom:   4,
    },
    statItem: {
        alignItems:        'center',
        paddingHorizontal: 24,
    },
    statNum: {
        fontSize:   18,
        fontWeight: '700',
        color:      '#070A1C',
    },
    statLabel: {
        fontSize:   13,
        fontWeight: '500',
        color:      '#81818D',
        marginTop:  2,
    },
    divider: {
        width:           1,
        backgroundColor: '#EBEBEB',
        marginVertical:  4,
    },
    actions: {
        flexDirection:  'row',
        gap:            12,
        marginTop:      16,
        justifyContent: 'center',
    },
    btnPrimary: {
        backgroundColor:   '#543C52',
        paddingHorizontal: 24,
        paddingVertical:   12,
        borderRadius:      24,
    },
    btnPrimaryText: {
        color:      '#fff',
        fontWeight: '700',
        fontSize:   15,
    },
    btnOutline: {
        borderWidth:       1,
        borderColor:       '#D0D0D0',
        paddingHorizontal: 24,
        paddingVertical:   12,
        borderRadius:      24,
    },
    btnOutlineText: {
        color:      '#1A1A1A',
        fontWeight: '600',
        fontSize:   15,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           6,
        marginBottom:  12,
    },
    sectionTitle: {
        fontSize:   14,
        fontWeight: '500',
        color:      '#81818D',
    },
    seeAll: {
        fontSize:   14,
        fontWeight: '500',
        color:      '#543C52',
    },
    separator: {
        height:          1,
        backgroundColor: '#EBEBEB',
        marginBottom:    12,
    },
    albumName: {
        fontSize:     15,
        fontWeight:   '500',
        color:        '#070A1C',
        marginBottom: 4,
    },
    albumMeta: {
        flexDirection: 'row',
        gap:           8,
        marginBottom:  12,
    },
    albumTopic: {
        fontSize:   13,
        fontWeight: '400',
        color:      '#070A1C',
    },
    albumYear: {
        fontSize:   13,
        fontWeight: '400',
        color:      '#81818D',
    },
    albumImage: {
        width:        '100%',
        height:       180,
        borderRadius: 12,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           10,
        marginBottom:  12,
    },
    postAvatarWrap: {
        position: 'relative',
    },
    postAvatar: {
        width:        46,
        height:       46,
        borderRadius: 23,
    },
    postOnlineDot: {
        position:        'absolute',
        bottom:          1,
        right:           1,
        width:           12,
        height:          12,
        borderRadius:    6,
        backgroundColor: '#D0D0D0',
        borderWidth:     2,
        borderColor:     '#fff',
    },
    postName: {
        fontSize:   15,
        fontWeight: '400',
        color:      '#070A1C',
    },
    postContent: {
        fontSize:     15,
        fontWeight:   '400',
        color:        '#070A1C',
        lineHeight:   22,
        marginBottom: 6,
    },
    postTag: {
        fontSize:     15,
        fontWeight:   '400',
        color:        '#543C52',
        marginBottom: 16,
    },
    postStats: {
        flexDirection: 'row',
        gap:           20,
    },
    statChip: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           6,
    },
    statChipText: {
        fontSize:   13,
        fontWeight: '400',
        color:      '#070A1C',
    },
});