import { View, Text, StyleSheet } from 'react-native';
import { Body } from '@/components';
import { PostsList, useGetAllPostsQuery } from '@/modules/posts';
import { COLORS } from '@/shared/consts';

export default function HomeScreen() {
    const { data: posts, isLoading } = useGetAllPostsQuery();
    return (
            <Body>
                <View style={styles.container}>
                    <PostsList
                        posts={posts}
                        isLoading={isLoading}
                        emptyText="Поки що немає публікацій"
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