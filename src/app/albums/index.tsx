import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui';
import { router } from 'expo-router';

export default function AlbumsScreen() {
    const hasAlbums = true;

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.card}>

                    <Text style={styles.title}>Мої альбоми</Text>

                    {hasAlbums ? (
                        <View style={styles.list}>

                            <TouchableOpacity
                                style={styles.album}
                                onPress={() => router.push('/albums/id')}
                            >
                                <Image
                                    source={{ uri: 'https://placehold.co/300x200' }}
                                    style={styles.cover}
                                />
                                <View style={styles.info}>
                                    <Text style={styles.name}>Настрій</Text>
                                    <Text style={styles.sub}>Природа • 2025 рік</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.addAlbum}
                                onPress={() => router.push('/albums/modal/create')}
                            >
                                <Text style={styles.plus}>＋</Text>
                                <Text style={styles.addText}>Додати альбом</Text>
                            </TouchableOpacity>

                        </View>
                    ) : (
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>Немає ще жодного альбому</Text>
                            <Button text="Створити альбом" onPress={() => router.push('/albums/modal/create')} />
                        </View>
                    )}

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F3F4F6' },
    scroll: { flexGrow: 1, padding: 16 },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        gap: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center',
    },
    list: { gap: 20 },
    album: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cover: { width: '100%', height: 160 },
    info: { padding: 12 },
    name: { fontSize: 18, fontWeight: '600' },
    sub: { color: '#6B7280', marginTop: 2 },
    addAlbum: {
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        paddingVertical: 32,
        alignItems: 'center',
        gap: 6,
    },
    plus: { fontSize: 32, color: '#9CA3AF' },
    addText: { color: '#6B7280', fontSize: 14 },
    empty: { alignItems: 'center', gap: 12 },
    emptyText: { color: '#6B7280' },
});


