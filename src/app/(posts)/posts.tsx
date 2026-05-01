import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useGetPostByIdQuery } from '@/modules/posts/api';
import { COLORS } from '@/shared/consts';

export default function PostDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data, isLoading } = useGetPostByIdQuery(Number(id) as any);

    if (isLoading) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={COLORS.primary} />
        </View>
    );

    const post = data?.[0];
    if (!post) return <Text>Пост не знайдено</Text>;

    return (
        <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: '700' }}>{post.title}</Text>
            <Text style={{ marginTop: 8 }}>{post.content}</Text>
        </View>
    );
}