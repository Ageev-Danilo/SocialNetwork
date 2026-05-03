import {
    View, Text, ScrollView, Image,
    ActivityIndicator, StyleSheet,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import type { PostResponse } from '../../api';
import { COLORS } from '@/shared/consts';

function HeartIcon() {
    return (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="#aaa" strokeWidth="1.5" fill="none"
            />
        </Svg>
    );
}

function EyeIcon() {
    return (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke="#aaa" strokeWidth="1.5" fill="none"
            />
            <Circle cx="12" cy="12" r="3" stroke="#aaa" strokeWidth="1.5" fill="none" />
        </Svg>
    );
}

interface Props {
    posts:     PostResponse[] | undefined;
    isLoading: boolean;
    emptyText?: string;
}

export function PostsList({ posts, isLoading, emptyText = 'Немає публікацій' }: Props) {
    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={COLORS.primary} />
            </View>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>{emptyText}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
        >
            {posts.map((item) => (
                <PostCard key={item.id.toString()} post={item} />
            ))}
        </ScrollView>
    );
}

function PostCard({ post }: { post: PostResponse }) {
    const initials = post.user?.email?.charAt(0).toUpperCase() ?? '?';

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <Text style={styles.email}>{post.user?.email ?? '—'}</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.dots}>•••</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.content}>{post.content}</Text>

            {post.tags.length > 0 && (
                <Text style={styles.hashtags}>
                    {post.tags.map((t) => t.name).join(' ')}
                </Text>
            )}

            {post.media.length > 0 && (
                <View style={styles.mediaContainer}>
                    {post.media.map((m) => (
                        <Image
                            key={m.id}
                            source={{ uri: m.url }}
                            style={styles.media}
                            resizeMode="cover"
                        />
                    ))}
                </View>
            )}

            <View style={styles.cardFooter}>
                <View style={styles.stat}>
                    <HeartIcon />
                    <Text style={styles.statText}>{post.likes} Вподобань</Text>
                </View>
                <View style={styles.stat}>
                    <EyeIcon />
                    <Text style={styles.statText}>{post.views} Переглядів</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    center:    { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
    emptyText: { fontSize: 15, color: '#888' },
    list:      { padding: 16, gap: 16, paddingBottom: 40 },

    card: {
        backgroundColor: '#fff',
        borderRadius:    16,
        padding:         16,
        gap:             8,
        elevation:       2,
        shadowColor:     '#000',
        shadowOpacity:   0.06,
        shadowRadius:    8,
        shadowOffset:    { width: 0, height: 2 },
    },
    cardHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
    avatar: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: COLORS.primary,
        justifyContent: 'center', alignItems: 'center',
    },
    avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    email:      { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
    dots:       { fontSize: 20, fontWeight: '700', color: '#81818D', letterSpacing: 2 },

    divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 4 },

    title:    { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
    content:  { fontSize: 14, color: '#444', lineHeight: 20 },
    hashtags: { fontSize: 13, color: COLORS.primary },

    mediaContainer: { gap: 8, marginTop: 4 },
    media: { width: '100%', height: 225, borderRadius: 12 },

    cardFooter: {
        flexDirection: 'row', gap: 20,
        marginTop: 4, paddingTop: 8,
        borderTopWidth: 1, borderTopColor: '#f5f5f5',
    },
    stat:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statText: { fontSize: 13, color: '#888' },
});