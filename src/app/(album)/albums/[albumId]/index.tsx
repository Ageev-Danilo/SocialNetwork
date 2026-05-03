import { useRouter, useSearchParams } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Icon } from '@shared/ui';

export default function AlbumDetailPage() {
    const router = useRouter();
    const { albumId } = useSearchParams();

    return (
        <ScrollView style={styles.page} contentContainerStyle={styles.content}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.pageTitle}>WORLD IT</Text>
                    <Text style={styles.pageSubtitle}>Альбом</Text>
                </View>
                <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/home/albums/create')}>
                    <Icon name="add" size={20} />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsRow}>
                <TouchableOpacity style={styles.tabActive}>
                    <Text style={styles.tabTextActive}>Альбоми</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tabButton}>
                    <Text style={styles.tabText}>Особиста інформація</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Мої фото</Text>
                <View style={styles.photoCard}>
                    <View style={styles.photoPlaceholder} />
                    <View style={styles.photoButtons}>
                        <Button type="outlined" onPress={() => router.push(`/home/albums/${albumId}/edit`)}>
                            Редагувати
                        </Button>
                        <Button type="filled" onPress={() => {}}>
                            Додати фото
                        </Button>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.rowBetween}>
                    <Text style={styles.sectionTitle}>Ностальгія</Text>
                    <TouchableOpacity style={styles.iconCircle}>
                        <Icon name="setting" size={18} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.albumMeta}>Природа · 2025 рік</Text>
                <View style={styles.photosGrid}>
                    <View style={styles.smallPhoto} />
                    <View style={styles.smallPhoto} />
                    <View style={styles.smallPhoto} />
                    <TouchableOpacity style={styles.smallPhotoAdd}>
                        <Icon name="add" size={24} />
                    </TouchableOpacity>
                </View>
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
        gap: 18,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1D1B20',
    },
    pageSubtitle: {
        marginTop: 4,
        color: '#6B6773',
    },
    iconButton: {
        borderWidth: 1,
        borderColor: '#D8CFDD',
        borderRadius: 16,
        padding: 10,
        backgroundColor: 'white',
    },
    tabsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#EDE8F3',
    },
    tabActive: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#543C52',
    },
    tabText: {
        color: '#6B6773',
    },
    tabTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1D1B20',
        marginBottom: 12,
    },
    photoCard: {
        borderRadius: 20,
        backgroundColor: '#F7F5F9',
        padding: 16,
        gap: 14,
    },
    photoPlaceholder: {
        height: 220,
        borderRadius: 20,
        backgroundColor: '#D9D0E1',
    },
    photoButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E3DCE7',
    },
    albumMeta: {
        color: '#6B6773',
        marginBottom: 16,
    },
    photosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    smallPhoto: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 18,
        backgroundColor: '#E7E0F2',
    },
    smallPhotoAdd: {
        width: '48%',
        aspectRatio: 1,
        borderRadius: 18,
        backgroundColor: '#F7F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D8CFDD',
    },
});
