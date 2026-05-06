import { useRouter } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Icon } from '@shared/ui';

const albums = [
    {
        id: 'nostalgiya',
        title: 'Ностальгія',
        theme: 'Природа',
        year: '2025 рік',
        photos: 4,
    }
];

export default function AlbumsPage() {
    const router = useRouter();

    return (
        <ScrollView style={styles.page} contentContainerStyle={styles.content}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.headerTitle}>Альбоми</Text>
                    <Text style={styles.headerSubtitle}>Твій фотоархів</Text>
                </View>
                <Button type="icon" onPress={() => router.push('/home/albums/create')}>
                    <Icon name="add" size={20} />
                </Button>
            </View>

            <View style={styles.section}>
                {albums.map((album) => (
                    <TouchableOpacity
                        key={album.id}
                        style={styles.albumCard}
                        onPress={() => router.push(`/home/albums/${album.id}`)}
                    >
                        <View style={styles.albumCover} />
                        <View style={styles.albumInfo}>
                            <Text style={styles.albumTitle}>{album.title}</Text>
                            <Text style={styles.albumMeta}>{album.theme} · {album.year}</Text>
                            <Text style={styles.albumMeta}>{album.photos} фото</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.createRow}>
                <Button type="filled" onPress={() => router.push('/home/albums/create')}>
                    Створити альбом
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#F8F7FA',
    },
    content: {
        padding: 16,
        gap: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1D1B20',
    },
    headerSubtitle: {
        color: '#6B6773',
        marginTop: 4,
    },
    section: {
        gap: 14,
    },
    albumCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 14,
        elevation: 2,
    },
    albumCover: {
        width: 90,
        height: 90,
        borderRadius: 18,
        backgroundColor: '#E7E0F2',
    },
    albumInfo: {
        flex: 1,
    },
    albumTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1D1B20',
        marginBottom: 6,
    },
    albumMeta: {
        color: '#6B6773',
        fontSize: 13,
    },
    createRow: {
        marginTop: 10,
    },
});
