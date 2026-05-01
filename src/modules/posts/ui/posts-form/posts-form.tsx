import { View, Text, ActivityIndicator, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useCreatePostMutation } from '../../api'; 
import { COLORS } from '@/shared/consts';
import { useForm, Controller } from 'react-hook-form';
import { postSchema, PostSchema } from '../../model';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Button } from '@/shared/ui';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://192.168.1.100:3000';

export function PostsForm() {
    const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
    const [localImageUri, setLocalImageUri] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>(['#відпочинок', '#натхнення', '#життя']); 

    const { control, handleSubmit, reset } = useForm<PostSchema>({
        defaultValues: {
            title: '',
            content: '',
            date: new Date().toLocaleDateString(), 
        },
        resolver: yupResolver(postSchema),
    });

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) {
            setLocalImageUri(result.assets[0].uri);
        }
    }

    async function onSubmit(values: PostSchema) {
        try {
            const postForm = new FormData();
            postForm.append('title', values.title);
            postForm.append('content', values.content);
            postForm.append('date', values.date);
            
            tags.forEach(tag => postForm.append('tags[]', tag));

            if (localImageUri) {
                postForm.append('media', {
                    uri: localImageUri,
                    name: `${Date.now()}.jpeg`,
                    type: 'image/jpeg',
                } as any);
            }

            await createPost(postForm as any).unwrap();
            Alert.alert('Успіх', 'Публікацію створено');
            reset();
            setLocalImageUri(null);
        } catch (error) {
            Alert.alert('Помилка', 'Не вдалося створити пост');
        }
    }

    const fields: { name: keyof PostSchema, label: string, holder: string }[] = [
        { name: 'title', label: 'Назва публікації', holder: 'Природа, книга і спокій 🌿' },
        { name: 'content', label: 'Текст публікації', holder: 'Напишіть текст тут...' },
        { name: 'date', label: 'Дата', holder: 'дд.мм.рррр' },
    ];

    return (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 20, backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Створення публікації</Text>

            <View style={{ gap: 12 }}>
                {fields.map((field) => (
                    <View key={field.name} style={{ gap: 4 }}>
                        <Text style={{ fontSize: 14, color: COLORS.black }}>{field.label}</Text>
                        <Controller
                            control={control}
                            name={field.name}
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <View>
                                    <Input
                                        holder={field.holder}
                                        value={value}
                                        onChangeText={onChange}
                                        multiline={field.name === 'content'}
                                    />
                                    {error && <Text style={{ color: COLORS.error, fontSize: 12 }}>{error.message}</Text>}
                                </View>
                            )}
                        />
                    </View>
                ))}
            </View>

            <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14 }}>Теги</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                    {tags.map((tag, index) => (
                        <View key={index} style={{ backgroundColor: '#f0f0f0', padding: 6, borderRadius: 8 }}>
                            <Text style={{ fontSize: 12, color: COLORS.primary }}>{tag}</Text>
                        </View>
                    ))}
                    <TouchableOpacity style={{ backgroundColor: COLORS.grey, padding: 6, borderRadius: 8 }}>
                        <Text style={{ fontSize: 12 }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ gap: 8 }}>
                <Text style={{ fontSize: 14 }}>Медіа</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    {localImageUri && (
                        <View>
                            <Image source={{ uri: localImageUri }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                            <TouchableOpacity 
                                onPress={() => setLocalImageUri(null)}
                                style={{ position: 'absolute', top: 2, right: 2, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10 }}
                            >
                                <Text style={{ color: 'white', padding: 2 }}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <TouchableOpacity 
                        onPress={pickImage}
                        style={{ width: 100, height: 100, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderStyle: 'dashed', borderWidth: 1 }}
                    >
                        <Text style={{ fontSize: 24 }}></Text> //
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ marginTop: 10, alignItems: 'center' }}>
                <Button
                    text={isCreating ? "Публікуємо..." : "Публікація"}
                    onPress={handleSubmit(onSubmit)}
                    type="fill"
                />
            </View>
        </ScrollView>
    );
}