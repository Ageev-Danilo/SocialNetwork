import {
    View, Text, ScrollView, TouchableOpacity,
    Image, StyleSheet, Alert, TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCreatePostMutation } from '../../api';
import { COLORS } from '@/shared/consts';
import { useForm, Controller } from 'react-hook-form';
import { postSchema } from '../../model';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { PostSchema } from '../../model';
import { Input } from '@/shared/ui';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const DEFAULT_TAGS = [
    '#відпочинок', '#натхнення', '#життя', '#природа',
    '#читання',   '#спокій',    '#гармонія',
    '#музика',    '#фільми',    '#подорожі',
];

interface Props { onSuccess?: () => void; }

function PhotoIcon() {
    return (
        <View style={styles.circle}>
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <Rect x="3" y="5" width="18" height="14" rx="2"
                    stroke={COLORS.primary} strokeWidth="1.5" />
                <Path d="M3 16l5-5 4 4 3-3 6 6"
                    stroke={COLORS.primary} strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx="8.5" cy="9.5" r="1.5"
                    stroke={COLORS.primary} strokeWidth="1.5" />
            </Svg>
        </View>
    );
}

function SmileIcon() {
    return (
        <View style={styles.circle}>
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9"
                    stroke={COLORS.primary} strokeWidth="1.5" />
                <Circle cx="9" cy="10" r="1" fill={COLORS.primary} />
                <Circle cx="15" cy="10" r="1" fill={COLORS.primary} />
                <Path d="M8.5 14.5c1 1.5 5.5 1.5 7 0"
                    stroke={COLORS.primary} strokeWidth="1.5"
                    strokeLinecap="round" />
            </Svg>
        </View>
    );
}

function SendIcon() {
    return (
        <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <Path
                d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                stroke="#fff" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
            />
        </Svg>
    );
}

export function PostsForm({ onSuccess }: Props) {
    const [createPost, { isLoading }] = useCreatePostMutation();
    const [images, setImages]             = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const { control, handleSubmit, reset } = useForm<PostSchema>({
        defaultValues: { title: '', topic: '', content: '', link: '' },
        resolver: yupResolver(postSchema) as any,
    });

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) setImages(prev => [...prev, result.assets[0].uri]);
    }

    function removeImage(uri: string) {
        setImages(prev => prev.filter(i => i !== uri));
    }

    function toggleTag(tag: string) {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    }

    async function onSubmit(values: PostSchema) {
        try {
            await createPost({
                title:   values.title,
                content: values.content,
                link:    values.link || undefined,
                media:   images.map(url => ({ url })),
                tags:    selectedTags.map(name => ({ name })),
            }).unwrap();

            reset();
            setImages([]);
            setSelectedTags([]);
            onSuccess?.();
        } catch {
            Alert.alert('Помилка', 'Не вдалося створити публікацію');
        }
    }

    return (
        <View style={styles.wrapper}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
            >
                <View style={styles.field}>
                    <Text style={styles.label}>Назва публікації</Text>
                    <Controller control={control} name="title"
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <>
                                <Input holder="Природа, книга і спокій 🌿" value={value} onChangeText={onChange} />
                                {error && <Text style={styles.error}>{error.message}</Text>}
                            </>
                        )}
                    />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Тема публікації</Text>
                    <Controller control={control} name="topic"
                        render={({ field: { onChange, value } }) => (
                            <Input holder="Напишіть тему публікації" value={value ?? ''} onChangeText={onChange} />
                        )}
                    />
                </View>

                <View style={styles.tagsContainer}>
                    {DEFAULT_TAGS.map(tag => {
                        const active = selectedTags.includes(tag);
                        return (
                            <TouchableOpacity
                                key={tag}
                                style={[styles.tag, active && styles.tagActive]}
                                onPress={() => toggleTag(tag)}
                            >
                                <Text style={[styles.tagText, active && styles.tagTextActive]}>
                                    {tag}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity style={styles.addTag}>
                        <Text style={styles.addTagText}>+</Text>
                    </TouchableOpacity>
                </View>

                <Controller control={control} name="content"
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <>
                            <View style={styles.descBox}>
                                <TextInput
                                    multiline
                                    style={styles.descInput}
                                    placeholder="Напишіть текст публікації..."
                                    placeholderTextColor="#aaa"
                                    value={value}
                                    onChangeText={onChange}
                                />
                                {selectedTags.length > 0 && (
                                    <View style={styles.tagPreviewRow}>
                                        <View style={styles.tagPreviewDivider} />
                                        <Text style={styles.tagPreviewLabel}>Теги:</Text>
                                        <Text style={styles.inlineTags}>
                                            {selectedTags.join(' ')}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            {error && <Text style={styles.error}>{error.message}</Text>}
                        </>
                    )}
                />
                <View style={styles.field}>
                    <Text style={styles.label}>Посилання</Text>
                    <View style={styles.linkRow}>
                        <Controller control={control} name="link"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View style={{ flex: 1 }}>
                                    <Input holder="https://www.instagram.com/world.it..."
                                        value={value ?? ''} onChangeText={onChange} />
                                    {error && <Text style={styles.error}>{error.message}</Text>}
                                </View>
                            )}
                        />
                        <TouchableOpacity style={styles.linkAddBtn}>
                            <Text style={styles.linkAddText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {images.map(uri => (
                    <View key={uri} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                        <TouchableOpacity onPress={() => removeImage(uri)} style={styles.deleteBtn}>
                            <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                                    stroke="#333" strokeWidth="1.5"
                                    strokeLinecap="round" strokeLinejoin="round" />
                                <Path d="M10 11v6M14 11v6"
                                    stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                            </Svg>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={pickImage}><PhotoIcon /></TouchableOpacity>
                <TouchableOpacity><SmileIcon /></TouchableOpacity>
                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    style={styles.publishBtn}
                >
                    <Text style={styles.publishText}>
                        {isLoading ? 'Зачекайте' : 'Публікація'}
                    </Text>
                    <SendIcon />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper:        { flex: 1 },
    scroll:         { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 10 },
    label:          { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
    field:          { marginBottom: 16, gap: 4 },
    error:          { fontSize: 12, color: '#e53e3e', marginTop: 4, marginLeft: 4 },

    tagsContainer:  { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    tag:            { backgroundColor: '#F2EEF5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    tagActive:      { backgroundColor: '#543C52' },
    tagText:        { color: '#5A4975', fontSize: 13, fontWeight: '500' },
    tagTextActive:  { color: '#fff' },
    addTag:         { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, borderColor: '#5A4975', justifyContent: 'center', alignItems: 'center' },
    addTagText:     { fontSize: 18, fontWeight: '600', color: '#5A4975' },

    descBox:           { borderWidth: 1, borderColor: '#E8E8E8', borderRadius: 16, backgroundColor: '#FAFAFA', overflow: 'hidden', marginBottom: 16 },
    descInput:         { padding: 15, minHeight: 100, fontSize: 15, textAlignVertical: 'top', color: '#1a1a1a' },
    tagPreviewRow:     { paddingHorizontal: 15, paddingBottom: 12 },
    tagPreviewDivider: { height: 1, backgroundColor: '#EBEBEB', marginBottom: 8 },
    tagPreviewLabel:   { fontSize: 11, color: '#999', marginBottom: 4 },
    inlineTags:        { fontSize: 14, color: '#543C52', lineHeight: 22 },

    linkRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
    linkAddBtn:  { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, borderColor: '#5A4975', justifyContent: 'center', alignItems: 'center' },
    linkAddText: { fontSize: 20, color: '#5A4975', fontWeight: '500' },

    imageWrapper: { width: '100%', height: 250, borderRadius: 20, marginTop: 15, position: 'relative', overflow: 'hidden' },
    image:        { width: '100%', height: '100%' },
    deleteBtn:    { position: 'absolute', top: 10, right: 10, backgroundColor: '#fff', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },

    footer:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#fff', gap: 12 },
    publishBtn:   { flexDirection: 'row', backgroundColor: '#5A4975', paddingHorizontal: 20, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', gap: 10, minWidth: 140 },
    publishText:  { color: '#fff', fontWeight: '700', fontSize: 15 },
    circle:       { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E8E8E8', justifyContent: 'center', alignItems: 'center' },
});