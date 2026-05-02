import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/shared/ui';
import { router } from 'expo-router'
import EditAlbumModal from './modal/edit'; 

export default function AlbumScreen() {
    const hasPhotos = true;
    

    const [isEditVisible, setIsEditVisible] = useState(false);

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.card}>

                    <View style={styles.header}>
                        <Button
                            type="outlined"
                            text="←"
                            style={styles.back}
                            onPress={() => router.back()}
                        />
                        <Text style={styles.title}>Настрій</Text>
                        <View style={{ width: 47 }} />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Мої фото</Text>

                        <View style={styles.row}>
                            <Image
                                source={{ uri: 'https://placehold.co/120x120' }}
                                style={styles.avatar}
                            />

                            <View style={styles.actions}>
                                <Button 
                                    text="Редагувати" 
                                    type="outlined" 
                                    style={styles.actionButton} 
                                    onPress={() => setIsEditVisible(true)} 
                                />
                                <Button text="Видалити" type="outlined" style={styles.actionButton} />
                            </View>
                        </View>

                        <Button text="Додати фото" />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Настрій</Text>
                        <Text style={styles.sub}>Природа • 2025 рік</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.label}>Фотографії</Text>

                        {hasPhotos ? (
                            <View style={styles.grid}>
                                <Image source={{ uri: 'https://placehold.co/120x120?1' }} style={styles.photo} />
                                <Image source={{ uri: 'https://placehold.co/120x120?2' }} style={styles.photo} />
                                <Image source={{ uri: 'https://placehold.co/120x120?3' }} style={styles.photo} />

                                <TouchableOpacity 
                                    style={styles.addBox}
                                    onPress={() => router.push('/albums/modal/create')}
                                >
                                    <View style={styles.plusCircle}>
                                        <Text style={styles.plusText}>+</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.empty}>
                                <Text style={styles.emptyText}>Немає ще жодного фото</Text>
                                <Button text="Додати фото" />
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            <EditAlbumModal 
                visible={isEditVisible} 
                onClose={() => setIsEditVisible(false)} 
            />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    back: { width: 47 },
    title: { fontSize: 24, fontWeight: '500' },
    section: { gap: 12 },
    label: { fontSize: 18, fontWeight: '600' },
    sub: { color: '#6B7280' },
    row: { flexDirection: 'row', gap: 16, alignItems: 'center' },
    avatar: {width: 96, height: 96, borderRadius: 16 },
    actions: { gap: 8, flex: 1 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    photo: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
    },
    addBox: {
        width: '30%', 
        aspectRatio: 0.8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
    },
    plusCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#9CA3AF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusText: {
        fontSize: 20,
        color: '#9CA3AF',
    },
    empty: { alignItems: 'center', gap: 12 },
    emptyText: { color: '#6B7280' },
    actionButton: {
        borderRadius: 8,
    },
});