import { View, StyleSheet } from 'react-native';
import { Body } from '@/components';
import { PostsList, useGetMyPostsQuery } from '@/modules/posts';

export default function MyPostsScreen() {
    const { data: posts, isLoading } = useGetMyPostsQuery();

    return (
        <Body>
            <View style={styles.container}>
                <PostsList
                    posts={posts}
                    isLoading={isLoading}
                    emptyText="У вас ще немає публікацій!"
                />
            </View>
        </Body>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});