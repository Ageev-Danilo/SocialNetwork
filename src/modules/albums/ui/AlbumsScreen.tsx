import { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    Image, Modal, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Input, Button, Icon } from '@/shared/ui';
import { BASE, COLORS } from '@/shared/consts';
import { THEMES, YEARS } from '@/modules/albums/albums.mock';
import {
    useGetMyAlbumsQuery,
    useCreateAlbumMutation,
    useUpdateAlbumMutation,
    useDeletePhotoMutation,
} from '@/modules/albums/api';
import type { AlbumResponse, AlbumPhotoResponse } from '@/modules/albums/api';

type IconName = "visible" | "img" | "add" | "logout" | "settings" | "home" | "chat" | "group" | "close" | "edit";

export function AlbumsScreen() {
    const { data: albums = [], isLoading } = useGetMyAlbumsQuery();
    const [createAlbum, { isLoading: isCreating }] = useCreateAlbumMutation();
    const [updateAlbum, { isLoading: isUpdating }] = useUpdateAlbumMutation();
    const [deletePhoto] = useDeletePhotoMutation(); 

    const [createOpen, setCreateOpen] = useState(false);
    const [editAlbum, setEditAlbum] = useState<AlbumResponse | null>(null);
    const [myPhotos, setMyPhotos] = useState<{ id: number; uri: string }[]>([]);

    async function addMyPhoto() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled) {
            setMyPhotos(prev => [...prev, { id: Date.now(), uri: result.assets[0].uri }]);
        }
    }

    function deleteMyPhoto(id: number) {
        setMyPhotos(prev => prev.filter(p => p.id !== id));
    }
    async function handleDeletePhotoFromAlbum(photoId: number) {
        console.log('Attempting to delete photo with ID:', photoId); 
        Alert.alert('Видалити фото?', 'Це фото буде назавжди видалено з альбому', [
            { text: 'Скасувати', style: 'cancel' },
            {
                text: 'Видалити',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deletePhoto(photoId).unwrap();
                    } catch (e) {
                        console.log('Delete error detail:', e);
                        Alert.alert('Помилка', 'Не вдалося видалити фото');
                    }
                },
            },
    ]);
}

    async function handleCreate(name: string, theme: string, date: string) {
        try {
            await createAlbum({ name, theme, date }).unwrap();
            setCreateOpen(false);
        } catch (e) {
            console.log('createAlbum error:', e);
        }
    }

    async function handleUpdate(name: string, theme: string, date: string) {
        if (!editAlbum) return;
        try {
            await updateAlbum({ id: editAlbum.id, name, theme, date }).unwrap();
            setEditAlbum(null);
        } catch (e) {
            console.log('updateAlbum error:', e);
        }
    }

    async function handleAddPhotoToAlbum(albumId: number) {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled) {
            try {
                await updateAlbum({
                    id: albumId,
                    photos: [{ url: result.assets[0].uri }],
                }).unwrap();
            } catch (e) {
                console.log('Upload error:', e);
            }
        }
    }

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <View style={[BASE.yc, { justifyContent: 'space-between', marginBottom: 16 }]}>
                        <Text style={styles.cardTitle}>Мої фото</Text>
                        <TouchableOpacity onPress={addMyPhoto} style={styles.addPhotoBtn}>
                            <Icon name="img" size={16} />
                            <Text style={styles.addPhotoBtnText}>Додати фото</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.photosGrid}>
                        {myPhotos.length === 0 ? (
                            <Text style={styles.noPhotosText}>У вас поки що немає фото</Text>
                        ) : (
                            myPhotos.map(photo => (
                                <PhotoThumb
                                    key={photo.id}
                                    uri={photo.uri}
                                    onDelete={() => deleteMyPhoto(photo.id)}
                                />
                            ))
                        )}
                    </View>
                </View>

                {albums.length === 0 ? (
                    <View style={[styles.card, BASE.yc, { justifyContent: 'space-between' }]}>
                        <Text style={styles.emptyText}>Немає ще жодного альбому</Text>
                        <TouchableOpacity onPress={() => setCreateOpen(true)} style={styles.circleBtn}>
                            <Text style={styles.circleBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {albums.map(album => (
                            <AlbumBlock
                                key={album.id}
                                album={album}
                                onEdit={() => setEditAlbum(album)}
                                onAddPhoto={() => handleAddPhotoToAlbum(album.id)}
                                onDeletePhoto={(photoId) => handleDeletePhotoFromAlbum(photoId)}
                            />
                        ))}
                        <View style={[styles.card, BASE.yc, { justifyContent: 'space-between' }]}>
                            <Text style={styles.emptyText}>Додати альбом</Text>
                            <TouchableOpacity onPress={() => setCreateOpen(true)} style={styles.circleBtn}>
                                <Text style={styles.circleBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>

            <AlbumFormModal
                visible={createOpen}
                title="Створити альбом"
                isLoading={isCreating}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
            />

            {editAlbum && (
                <AlbumFormModal
                    visible
                    title="Редагувати альбом"
                    initialName={editAlbum.name}
                    initialTheme={editAlbum.theme}
                    initialYear={editAlbum.date}
                    isLoading={isUpdating}
                    onClose={() => setEditAlbum(null)}
                    onSubmit={handleUpdate}
                />
            )}
        </View>
    );
}

function ActionBtn({ name, onPress }: { name: IconName, onPress?: () => void }) {
    return (
        <TouchableOpacity style={actionStyles.btn} onPress={onPress}>
            <Icon name={name} size={18} />
        </TouchableOpacity>
    );
}

const actionStyles = StyleSheet.create({
    btn: {
        width:           40,
        height:          40,
        borderRadius:    20,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent:  'center',
        alignItems:      'center',
    },
});

function PhotoThumb({ uri, onDelete }: { uri: string; onDelete: () => void }) {
    return (
        <View style={thumb.wrap}>
            <Image source={{ uri }} style={thumb.img} resizeMode="cover" />
            <View style={thumb.actions}>
                <ActionBtn name="visible" />
                <ActionBtn name="close" onPress={onDelete} />
            </View>
        </View>
    );
}

const thumb = StyleSheet.create({
    wrap: {
        width:           200,
        height:          200,
        borderRadius:    12,
        overflow:        'hidden',
        position:        'relative',
        backgroundColor: '#f0f0f0',
    },
    img:     { width: '100%', height: '100%' },
    actions: { position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', gap: 8 },
});

interface AlbumBlockProps {
    album:          AlbumResponse;
    onEdit:         () => void;
    onAddPhoto:     () => void;
    onDeletePhoto:  (id: number) => void;
}

function AlbumBlock({ album, onEdit, onAddPhoto, onDeletePhoto }: AlbumBlockProps) {
    return (
        <View style={styles.card}>
            <View style={[BASE.yc, { justifyContent: 'space-between', marginBottom: 8 }]}>
                <Text style={album_s.name}>{album.name}</Text>
                <View style={[BASE.yc, { gap: 6 }]}>
                    <TouchableOpacity style={album_s.iconCircle}><Icon name="visible" size={17} /></TouchableOpacity>
                    <TouchableOpacity style={album_s.iconCircle} onPress={onEdit}><Icon name="edit" size={17} /></TouchableOpacity>
                </View>
            </View>

            <View style={[BASE.yc, { gap: 16, marginBottom: 12 }]}>
                <Text style={album_s.theme}>{album.theme}</Text>
                <Text style={album_s.year}>{album.date} рік</Text>
            </View>

            <View style={album_s.divider} />
            <Text style={album_s.photosLabel}>Фотографіії</Text>

            <View style={album_s.grid}>
                {album.photos.map((photo: AlbumPhotoResponse) => (
                    <View key={photo.id} style={album_s.photoWrap}>
                        <Image source={{ uri: photo.url }} style={album_s.photoImg} resizeMode="cover" />
                        <View style={album_s.photoActions}>
                            <ActionBtn name="visible" />
                            <ActionBtn name="close" onPress={() => onDeletePhoto(photo.id)} />
                        </View>
                    </View>
                ))}
                <TouchableOpacity onPress={onAddPhoto} style={album_s.addPhoto}>
                    <Text style={album_s.addPhotoPlus}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const album_s = StyleSheet.create({
    name: { fontSize: 16, fontWeight: '500', color: '#1a1a1a' },
    iconCircle: {
        width:          34,
        height:         34,
        borderRadius:   17,
        borderWidth:    1,
        borderColor:    '#E3DCE7',
        justifyContent: 'center',
        alignItems:     'center',
        backgroundColor: '#fff',
    },
    theme:       { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
    year:        { fontSize: 14, color: '#81818D' },
    divider:     { height: 1, backgroundColor: '#EBEBEB', marginBottom: 12 },
    photosLabel: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 10 },
    grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    photoWrap: {
        width:           162,
        height:          162,
        borderRadius:    12,
        overflow:        'hidden',
        position:        'relative',
        backgroundColor: '#eee',
    },
    photoImg:     { width: '100%', height: '100%' },
    photoActions: { position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', gap: 8 },
    addPhoto: {
        width:          162,
        height:         162,
        borderRadius:   12,
        borderWidth:    1,
        borderStyle:    'dashed',
        borderColor:    COLORS.primary,
        justifyContent: 'center',
        alignItems:     'center',
        backgroundColor: '#fff',
    },
    addPhotoPlus: { fontSize: 32, color: COLORS.primary },
});

interface AlbumFormModalProps {
    visible:       boolean;
    title:         string;
    isLoading:     boolean;
    initialName?:  string;
    initialTheme?: string;
    initialYear?:  string;
    onClose:       () => void;
    onSubmit:      (name: string, theme: string, year: string) => void;
}

function AlbumFormModal({
    visible, title, isLoading,
    initialName  = '',
    initialTheme = '',
    initialYear  = '',
    onClose, onSubmit,
}: AlbumFormModalProps) {
    const [name,      setName]      = useState(initialName);
    const [theme,     setTheme]     = useState(initialTheme);
    const [year,      setYear]      = useState(initialYear);
    const [themeOpen, setThemeOpen] = useState(false);
    const [yearOpen,  setYearOpen]  = useState(false);

    function handleSubmit() {
        if (!name.trim()) return;
        onSubmit(name.trim(), theme, year);
    }

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={modal.overlay}>
                <View style={modal.container}>
                    <View style={[BASE.yc, { justifyContent: 'space-between', marginBottom: 20 }]}>
                        <Text style={modal.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={modal.closeBtn}>
                            <Icon name="close" size={18} />
                        </TouchableOpacity>
                    </View>

                    <View style={modal.field}>
                        <Text style={modal.label}>Назва альбому</Text>
                        <Input value={name} onChangeText={setName} holder="Настрій" />
                    </View>

                    <View style={modal.field}>
                        <Text style={modal.label}>Оберіть тему</Text>
                        <TouchableOpacity
                            style={modal.select}
                            onPress={() => { setThemeOpen(v => !v); setYearOpen(false); }}
                        >
                            <Text style={theme ? modal.selectValue : modal.selectPlaceholder}>
                                {theme || 'Природа'}
                            </Text>
                            <Text style={{ color: '#666' }}>∨</Text>
                        </TouchableOpacity>
                        {themeOpen && (
                            <View style={modal.dropdown}>
                                {THEMES.map(t => (
                                    <TouchableOpacity
                                        key={t}
                                        style={modal.dropdownItem}
                                        onPress={() => { setTheme(t); setThemeOpen(false); }}
                                    >
                                        <Text style={modal.dropdownText}>{t}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={modal.field}>
                        <Text style={modal.label}>Рік альбому</Text>
                        <TouchableOpacity
                            style={modal.select}
                            onPress={() => { setYearOpen(v => !v); setThemeOpen(false); }}
                        >
                            <Text style={year ? modal.selectValue : modal.selectPlaceholder}>
                                {year ? `${year} рік` : 'Оберіть рік'}
                            </Text>
                            <Text style={{ color: '#666' }}>∨</Text>
                        </TouchableOpacity>
                        {yearOpen && (
                            <View style={modal.dropdown}>
                                {YEARS.map(y => (
                                    <TouchableOpacity
                                        key={y}
                                        style={modal.dropdownItem}
                                        onPress={() => { setYear(y); setYearOpen(false); }}
                                    >
                                        <Text style={modal.dropdownText}>{y} рік</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View style={[BASE.yc, { justifyContent: 'flex-end', gap: 10, marginTop: 20 }]}>
                        <Button type="outline" text="Скасувати" onPress={onClose} />
                        <Button
                            type="fill"
                            text={isLoading ? 'Зберігаємо...' : 'Зберегти'}
                            onPress={handleSubmit}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: '#f7f4ff',
    },
    center: {
        flex:           1,
        justifyContent: 'center',
        alignItems:     'center',
    },
    scroll: {
        padding:       16,
        gap:           14,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius:    16,
        padding:         16,
    },
    cardTitle: {
        fontSize:   16,
        fontWeight: '600',
        color:      '#1a1a1a',
    },
    addPhotoBtn: {
        flexDirection:     'row',
        alignItems:        'center',
        gap:               6,
        paddingHorizontal: 12,
        paddingVertical:   6,
        borderWidth:       1,
        borderColor:       '#CDCED2',
        borderRadius:      20,
    },
    addPhotoBtnText: {
        fontSize: 13,
        color:    COLORS.primary,
    },
    photosGrid: {
        flexDirection: 'row',
        flexWrap:      'wrap',
        gap:           10,
    },
    emptyText: {
        fontSize:   15,
        fontWeight: '500',
        color:      '#1a1a1a',
    },
    circleBtn: {
        width:          36,
        height:         36,
        borderRadius:   18,
        borderWidth:    1,
        borderColor:    COLORS.primary,
        justifyContent: 'center',
        alignItems:     'center',
    },
    circleBtnText: {
        fontSize:   22,
        color:      COLORS.primary,
        lineHeight: 26,
    },
    noPhotosText: {
        fontSize:        14,
        color:           '#81818D',
        fontStyle:       'italic',
        paddingVertical: 10,
    },
});

const modal = StyleSheet.create({
    overlay: {
        flex:            1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent:  'center',
        alignItems:      'center',
        padding:         20,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius:    20,
        padding:         24,
        width:           '100%',
    },
    title: {
        fontSize:   18,
        fontWeight: '700',
        color:      '#1a1a1a',
    },
    closeBtn: {
        width:           32,
        height:          32,
        borderRadius:    16,
        backgroundColor: '#f0f0f0',
        justifyContent:  'center',
        alignItems:      'center',
    },
    field: {
        gap:       6,
        marginTop: 14,
    },
    label: {
        fontSize:   14,
        fontWeight: '500',
        color:      '#1a1a1a',
    },
    select: {
        flexDirection:     'row',
        justifyContent:    'space-between',
        alignItems:        'center',
        borderWidth:       1,
        borderColor:       '#CDCED2',
        borderRadius:      10,
        paddingHorizontal: 16,
        paddingVertical:   12,
    },
    selectPlaceholder: {
        color:    '#999',
        fontSize: 14,
    },
    selectValue: {
        color:    '#1a1a1a',
        fontSize: 14,
    },
    dropdown: {
        borderWidth:     1,
        borderColor:     '#eee',
        borderRadius:    10,
        backgroundColor: '#fff',
        elevation:       4,
        shadowColor:     '#000',
        shadowOpacity:   0.08,
        shadowRadius:    8,
        shadowOffset:    { width: 0, height: 2 },
    },
    dropdownItem: {
        paddingHorizontal: 16,
        paddingVertical:   12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    dropdownText: {
        fontSize: 14,
        color:    '#1a1a1a',
    },
});