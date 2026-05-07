import { useState } from 'react';
import {
    View, Text, ScrollView, Image,
    TouchableOpacity, StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Button, Icon } from '@/shared/ui';
import { BASE, COLORS } from '@/shared/consts';
import { MOCK_ALBUMS } from '@/modules/albums/albums.mock';
import type { AlbumPhoto } from '@/modules/albums/albums.mock';

export default function AlbumDetailScreen() {
    const { albumId } = useLocalSearchParams<{ albumId: string }>();

    const found = MOCK_ALBUMS.find((a) => a.id === Number(albumId));

    const [photos, setPhotos] = useState<AlbumPhoto[]>(found?.photos ?? []);

    async function addPhoto() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality:    0.8,
        });
        if (!result.canceled) {
            setPhotos((prev) => [
                ...prev,
                { id: Date.now(), uri: result.assets[0].uri },
            ]);
        }
    }

    function removePhoto(id: number) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
    }

    if (!found) {
        return (
            <View style={styles.center}>
                <Text style={{ color: '#888' }}>Альбом не знайдено</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <View style={[BASE.yc, styles.header]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{found.name}</Text>
                <Button
                    type="outline"
                    onPress={() =>
                        router.push(`/(album)/albums/${albumId}/edit` as any)
                    }
                >
                    <Icon name="edit" size={18} />
                </Button>
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={[BASE.yc, { gap: 12 }]}>
                    <Text style={styles.meta}>{found.theme}</Text>
                    <Text style={styles.meta}>{found.year} рік</Text>
                </View>

                <Text style={styles.sectionLabel}>Фотографіії</Text>

                <View style={styles.grid}>
                    {photos.map((photo) => (
                        <View key={photo.id} style={styles.photoWrapper}>
                            <Image
                                source={{ uri: photo.uri }}
                                style={styles.photo}
                                resizeMode="cover"
                            />
                            <View style={styles.photoOverlay}>
                                <TouchableOpacity style={styles.photoBtn}>
                                    <Icon name="visible" size={14} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.photoBtn}
                                    onPress={() => removePhoto(photo.id)}
                                >
                                    <Icon name="close" size={14} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <TouchableOpacity onPress={addPhoto} style={styles.addPhoto}>
                        <Text style={styles.addPhotoPlus}>+</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: '#F8F7FA',
    },
    center: {
        flex:           1,
        justifyContent: 'center',
        alignItems:     'center',
    },
    header: {
        justifyContent:  'space-between',
        paddingHorizontal: 16,
        paddingVertical:  12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backBtn: {
        padding: 4,
    },
    backText: {
        fontSize:   28,
        color:      COLORS.primary,
        lineHeight: 30,
    },
    headerTitle: {
        fontSize:   17,
        fontWeight: '700',
        color:      '#1a1a1a',
    },
    scroll: {
        padding:       16,
        gap:           16,
        paddingBottom: 40,
    },
    meta: {
        fontSize: 14,
        color:    '#888',
    },
    sectionLabel: {
        fontSize:   15,
        fontWeight: '600',
        color:      '#1a1a1a',
        marginTop:  4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap:      'wrap',
        gap:           10,
    },
    photoWrapper: {
        width:        '47%',
        aspectRatio:  1,
        borderRadius: 14,
        overflow:     'hidden',
        position:     'relative',
    },
    photo: {
        width:  '100%',
        height: '100%',
    },
    photoOverlay: {
        position:      'absolute',
        bottom:        6,
        left:          6,
        flexDirection: 'row',
        gap:           6,
    },
    photoBtn: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius:    20,
        padding:         6,
        justifyContent:  'center',
        alignItems:      'center',
    },
    addPhoto: {
        width:          '47%',
        aspectRatio:    1,
        borderRadius:   14,
        borderWidth:    1,
        borderStyle:    'dashed',
        borderColor:    '#ccc',
        justifyContent: 'center',
        alignItems:     'center',
    },
    addPhotoPlus: {
        fontSize: 32,
        color:    '#aaa',
    },
});