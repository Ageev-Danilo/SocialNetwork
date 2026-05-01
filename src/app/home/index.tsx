import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import { Body } from '@/components';
import { useGetAllPostsQuery } from '@/modules/posts/api'; // Шлях до твого API
import { COLORS } from '@/shared/consts';

export default function HomeScreen() {
    const { data: posts, isLoading, error } = useGetAllPostsQuery();

    if (isLoading) {
        return <ActivityIndicator style={{ flex: 1 }} color={COLORS.primary} />;
    }

    return (
        <Body>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{
                        padding: 16,
                        backgroundColor: 'white',
                        marginHorizontal: 16,
                        marginTop: 12,
                        borderRadius: 12,
                        elevation: 2,
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
                        <Text style={{ color: '#666', marginVertical: 8 }}>{item.content}</Text>
                        
                        {item.media && item.media.length > 0 && (
                            <Image 
                                source={{ uri: item.media[0].url }} 
                                style={{ width: '100%', height: 200, borderRadius: 8, marginTop: 8 }} 
                            />
                        )}
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text style={{ fontSize: 12, color: COLORS.grey }}>{item.date}</Text>
                            <Text style={{ fontSize: 12, color: COLORS.primary }}>Views: {item.views}</Text>
                        </View>
                    </View>
                )}
            />
        </Body>
    );
}