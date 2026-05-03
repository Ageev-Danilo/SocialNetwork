import { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, Alert,
    ActivityIndicator, Image, TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { Input, Button } from '@/shared/ui';
import { COLORS } from '@/shared/consts';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../api';
import { settingsSchema } from '../../model';
import type { SettingsSchema } from '../../model';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://192.168.1.100:3000';

export function SettingsForm() {
    const { data, isLoading } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [localImageUri, setLocalImageUri] = useState<string | null>(null);

    const { control, handleSubmit, reset } = useForm<SettingsSchema>({
        defaultValues: {
            firstName: '',
            lastName:  '',
            username:  '',
            pseudonym: '',
            date:      '',
            signature: '',
        },
        resolver: yupResolver(settingsSchema),
    });

    useEffect(() => {
        if (data) {
            console.log('profileImage:', data.profileImage);
            console.log('full url:', `${BASE_URL}/media/thumbnail/${data.profileImage}`);
            reset({
                firstName: data.firstName,
                lastName:  data.lastName,
                username:  data.username,
                pseudonym: data.pseudonym,
                date:      data.date,
                signature: data.signature ?? '',
            });
        }
    }, [data]);

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

    async function onSubmit(values: SettingsSchema) {
        try {
            const form = new FormData();

            form.append('firstName', values.firstName);
            form.append('lastName',  values.lastName);
            form.append('username',  values.username);
            form.append('pseudonym', values.pseudonym);
            form.append('date',      values.date);
            form.append('signature', values.signature ?? '');

            if (localImageUri) {
                form.append('profileImage', {
                    uri:  localImageUri,
                    type: 'image/jpeg',
                    name: `${Date.now()}.jpeg`,
                } as any);
            }

            await updateSettings(form).unwrap();
            Alert.alert('Готово', 'Налаштування збережено');
        } catch {
            Alert.alert('Помилка', 'Не вдалося зберегти налаштування');
        }
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={COLORS.primary} />
            </View>
        );
    }

    const imageSource = localImageUri
        ? { uri: localImageUri }
        : data?.profileImage
            ? { uri: `${BASE_URL}/media/thumbnail/${data.profileImage}` }
            : null;

    const fields: {
        name: keyof SettingsSchema;
        label: string;
        holder: string;
        type?: 'text' | 'email' | 'pwd';
    }[] = [
        { name: 'firstName', label: "Ім'я",            holder: "Введи ім'я" },
        { name: 'lastName',  label: 'Прізвище',        holder: 'Введи прізвище' },
        { name: 'username',  label: 'Нікнейм',         holder: '@username' },
        { name: 'pseudonym', label: 'Псевдонім',       holder: 'Введи псевдонім' },
        { name: 'date',      label: 'Дата народження', holder: 'дд.мм.рррр' },
        { name: 'signature', label: 'Підпис',          holder: 'Введи підпис' },
    ];

    return (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>

            {/* Аватар */}
            <View style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                gap: 8,
            }}>
                <TouchableOpacity onPress={pickImage}>
                    {imageSource ? (
                        <Image
                            source={imageSource}
                            style={{
                                width: 90, height: 90,
                                borderRadius: 45,
                                borderWidth: 2,
                                borderColor: COLORS.primary,
                            }}
                        />
                    ) : (
                        <View style={{
                            width: 90, height: 90,
                            borderRadius: 45,
                            backgroundColor: COLORS.grey,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderColor: COLORS.primary,
                        }}>
                            <Text style={{ fontSize: 32 }}>📷</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>
                    {localImageUri ? 'Фото вибрано' : 'Змінити фото'}
                </Text>
            </View>


            <View style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 16,
                gap: 12,
            }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.black }}>
                    Особиста інформація
                </Text>

                {fields.map(({ name, label, holder, type = 'text' }) => (
                    <Controller
                        key={name}
                        control={control}
                        name={name}
                        render={({ field, fieldState }) => (
                            <View style={{ gap: 4 }}>
                                <Text style={{ fontSize: 13, color: COLORS.black, opacity: 0.6 }}>
                                    {label}
                                </Text>
                                <Input
                                    type={type}
                                    holder={holder}
                                    value={field.value ?? ''}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                />
                                {fieldState.error && (
                                    <Text style={{ fontSize: 12, color: COLORS.error }}>
                                        {fieldState.error.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    />
                ))}
            </View>

            <View style={{ alignItems: 'center', paddingBottom: 32 }}>
                <Button
                    type="fill"
                    text={isUpdating ? 'Збереження...' : 'Зберегти'}
                    onPress={() => handleSubmit(onSubmit)()}
                />
            </View>

        </ScrollView>
    );
}