import { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    Image, Modal, StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Input, Button, Icon } from '@/shared/ui';
import { BASE, COLORS } from '@/shared/consts';
import {
    MOCK_ALBUMS, MOCK_MY_PHOTOS,
    THEMES, YEARS,
} from '@/modules/albums/albums.mock';
import type { Album, AlbumPhoto } from '@/modules/albums/albums.mock';

export function AlbumsScreen() {
    const [myPhotos, setMyPhotos] = useState<AlbumPhoto[]>(MOCK_MY_PHOTOS);
    const [albums,   setAlbums]   = useState<Album[]>(MOCK_ALBUMS);
    const [createOpen, setCreateOpen] = useState(false);
    const [editAlbum,  setEditAlbum]  = useState<Album | null>(null);

    async function addMyPhoto() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality:    0.8,
        });
        if (!result.canceled) {
            setMyPhotos(prev => [
                ...prev,
                { id: Date.now(), uri: result.assets[0].uri },
            ]);
        }
    }

    function deleteMyPhoto(id: number) {
        setMyPhotos(prev => prev.filter(p => p.id !== id));
    }

    function handleCreate(name: string, theme: string, year: string) {
        setAlbums(prev => [
            ...prev,
            { id: Date.now(), name, theme, year, photos: [] },
        ]);
        setCreateOpen(false);
    }

    function handleUpdate(updated: Album) {
        setAlbums(prev => prev.map(a => a.id === updated.id ? updated : a));
        setEditAlbum(null);
    }

    function deleteAlbum(id: number) {
        setAlbums(prev => prev.filter(a => a.id !== id));
    }

    async function addPhotoToAlbum(albumId: number) {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality:    0.8,
        });
        if (!result.canceled) {
            setAlbums(prev => prev.map(a =>
                a.id === albumId
                    ? { ...a, photos: [...a.photos, { id: Date.now(), uri: result.assets[0].uri }] }
                    : a,
            ));
        }
    }

    function deletePhotoFromAlbum(albumId: number, photoId: number) {
        setAlbums(prev => prev.map(a =>
            a.id === albumId
                ? { ...a, photos: a.photos.filter(p => p.id !== photoId) }
                : a,
        ));
    }

    return (
        <View style={styles.screen}>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View style={[BASE.yc, { justifyContent: 'space-between', marginBottom: 16 }]}>
                        <Text style={styles.cardTitle}>Мої фото</Text>
                        <TouchableOpacity onPress={addMyPhoto} style={styles.addPhotoBtn}>
                            <Icon name="img" size={16} />
                            <Text style={styles.addPhotoBtnText}>Додати фото</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.photosGrid}>
                        {myPhotos.map(photo => (
                            <PhotoThumb
                                key={photo.id}
                                uri={photo.uri}
                                onDelete={() => deleteMyPhoto(photo.id)}
                            />
                        ))}
                    </View>
                </View>

                {albums.length === 0 ? (
                    <View style={[styles.card, BASE.yc, { justifyContent: 'space-between' }]}>
                        <Text style={styles.emptyText}>Немає ще жодного альбому</Text>
                        <TouchableOpacity
                            onPress={() => setCreateOpen(true)}
                            style={styles.circleBtn}
                        >
                            <Text style={styles.circleBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {albums.map(album => (
                            <AlbumBlock
                                key={album.id}
                                album={album}
                                onEdit={()           => setEditAlbum(album)}
                                onDelete={()         => deleteAlbum(album.id)}
                                onAddPhoto={()       => addPhotoToAlbum(album.id)}
                                onDeletePhoto={(pid) => deletePhotoFromAlbum(album.id, pid)}
                            />
                        ))}
                        <View style={[styles.card, BASE.yc, { justifyContent: 'space-between' }]}>
                            <Text style={styles.emptyText}>Додати альбом</Text>
                            <TouchableOpacity
                                onPress={() => setCreateOpen(true)}
                                style={styles.circleBtn}
                            >
                                <Text style={styles.circleBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>

            <AlbumFormModal
                visible={createOpen}
                title="Створити альбом"
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
            />
            {editAlbum && (
                <AlbumFormModal
                    visible
                    title="Редагувати альбом"
                    initialName={editAlbum.name}
                    initialTheme={editAlbum.theme}
                    initialYear={editAlbum.year}
                    onClose={() => setEditAlbum(null)}
                    onSubmit={(name, theme, year) =>
                        handleUpdate({ ...editAlbum, name, theme, year })
                    }
                />
            )}
        </View>
    );
}

function PhotoThumb({ uri, onDelete }: { uri: string; onDelete: () => void }) {
    return (
        <View style={thumb.wrap}>
            <Image source={{ uri }} style={thumb.img} resizeMode="cover" />
            <View style={thumb.actions}>
                <TouchableOpacity style={thumb.btn}>
                    <Icon name="visible" size={15} />
                </TouchableOpacity>
                <TouchableOpacity style={thumb.btn} onPress={onDelete}>
                    <Icon name="close" size={15} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const thumb = StyleSheet.create({
    wrap: {
        width:        140,
        height:       140,
        borderRadius: 12,
        overflow:     'hidden',
        position:     'relative',
    },
    img: {
        width:  '100%',
        height: '100%',
    },
    actions: {
        position:      'absolute',
        bottom:        6,
        left:          6,
        flexDirection: 'row',
        gap:           6,
    },
    btn: {
        width:           30,
        height:          30,
        borderRadius:    15,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent:  'center',
        alignItems:      'center',
    },
});

interface AlbumBlockProps {
    album:         Album;
    onEdit:        () => void;
    onDelete:      () => void;
    onAddPhoto:    () => void;
    onDeletePhoto: (photoId: number) => void;
}

function AlbumBlock({ album, onEdit, onDelete, onAddPhoto, onDeletePhoto }: AlbumBlockProps) {
    return (
        <View style={styles.card}>
            <View style={[BASE.yc, { justifyContent: 'space-between', marginBottom: 8 }]}>
                <Text style={album_s.name}>{album.name}</Text>
                <View style={[BASE.yc, { gap: 6 }]}>
                    <TouchableOpacity style={album_s.iconCircle}>
                        <Icon name="visible" size={17} />
                    </TouchableOpacity>
                    <TouchableOpacity style={album_s.iconCircle} onPress={onEdit}>
                        <Icon name="edit" size={17} />
                    </TouchableOpacity>
                    <TouchableOpacity style={album_s.iconCircle} onPress={onDelete}>
                        <Icon name="close" size={17} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[BASE.yc, { gap: 16, marginBottom: 12 }]}>
                <Text style={album_s.theme}>{album.theme}</Text>
                <Text style={album_s.year}>{album.year} рік</Text>
            </View>

            <View style={album_s.divider} />
            <Text style={album_s.photosLabel}>Фотографіії</Text>

            <View style={album_s.grid}>
                {album.photos.map(photo => (
                    <View key={photo.id} style={album_s.photoWrap}>
                        <Image
                            source={{ uri: photo.uri }}
                            style={album_s.photoImg}
                            resizeMode="cover"
                        />
                        <View style={thumb.actions}>
                            <TouchableOpacity style={thumb.btn}>
                                <Icon name="visible" size={13} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={thumb.btn}
                                onPress={() => onDeletePhoto(photo.id)}
                            >
                                <Icon name="close" size={13} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <TouchableOpacity onPress={onAddPhoto} style={album_s.addPhoto}>
                    <View style={album_s.addPhotoCircle}>
                        <Text style={album_s.addPhotoPlus}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const album_s = StyleSheet.create({
    name: { fontSize: 16, fontWeight: '500', color: '#1a1a1a' },
    iconCircle: {
        width: 34, height: 34, borderRadius: 17,
        borderWidth: 1, borderColor: '#E3DCE7',
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#fff',
    },
    theme: { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
    year:  { fontSize: 14, color: '#81818D' },
    divider: { height: 1, backgroundColor: '#EBEBEB', marginBottom: 12 },
    photosLabel: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 10 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    photoWrap: { width: '47%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', position: 'relative' },
    photoImg:  { width: '100%', height: '100%' },
    addPhoto: {
        width: '47%', aspectRatio: 1, borderRadius: 12,
        borderWidth: 1, borderStyle: 'dashed', borderColor: '#CDCED2',
        justifyContent: 'center', alignItems: 'center',
    },
    addPhotoCircle: {
        width: 40, height: 40, borderRadius: 20,
        borderWidth: 1, borderColor: COLORS.primary,
        justifyContent: 'center', alignItems: 'center',
    },
    addPhotoPlus: { fontSize: 22, color: COLORS.primary, lineHeight: 26 },
});

interface AlbumFormModalProps {
    visible:       boolean;
    title:         string;
    initialName?:  string;
    initialTheme?: string;
    initialYear?:  string;
    onClose:       () => void;
    onSubmit:      (name: string, theme: string, year: string) => void;
}

function AlbumFormModal({
    visible, title,
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
        setName(''); setTheme(''); setYear('');
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
                        <Button type="fill"    text="Зберегти"  onPress={handleSubmit} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#f7f4ff' },
    scroll: { padding: 16, gap: 14, paddingBottom: 40 },
    card:   { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
    cardTitle:      { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
    addPhotoBtn:    {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 6,
        borderWidth: 1, borderColor: '#CDCED2', borderRadius: 20,
    },
    addPhotoBtnText: { fontSize: 13, color: COLORS.primary },
    photosGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    emptyText:       { fontSize: 15, fontWeight: '500', color: '#1a1a1a' },
    circleBtn: {
        width: 36, height: 36, borderRadius: 18,
        borderWidth: 1, borderColor: COLORS.primary,
        justifyContent: 'center', alignItems: 'center',
    },
    circleBtnText: { fontSize: 22, color: COLORS.primary, lineHeight: 26 },
});

const modal = StyleSheet.create({
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center', alignItems: 'center', padding: 20,
    },
    container: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '100%' },
    title:     { fontSize: 18, fontWeight: '700', color: '#1a1a1a' },
    closeBtn:  {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center',
    },
    field:    { gap: 6, marginTop: 14 },
    label:    { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
    select: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderWidth: 1, borderColor: '#CDCED2', borderRadius: 10,
        paddingHorizontal: 16, paddingVertical: 12,
    },
    selectPlaceholder: { color: '#999', fontSize: 14 },
    selectValue:       { color: '#1a1a1a', fontSize: 14 },
    dropdown: {
        borderWidth: 1, borderColor: '#eee', borderRadius: 10,
        backgroundColor: '#fff', elevation: 4,
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    dropdownItem: {
        paddingHorizontal: 16, paddingVertical: 12,
        borderBottomWidth: 1, borderBottomColor: '#f5f5f5',
    },
    dropdownText: { fontSize: 14, color: '#1a1a1a' },
});