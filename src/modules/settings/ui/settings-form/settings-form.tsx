import { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Alert,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { Input, Button, Icon } from '@/shared/ui';
import { COLORS, settingFields } from '@/shared/consts';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../api';
import { settingsSchema } from '../../model';
import type { SettingsSchema } from '../../model';
import { Card } from '@/components/Settings/Card';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://192.168.1.100:3000';

export function SettingsForm() {
    const { data, isLoading, isSuccess } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [localImageUri, setLocalImageUri] = useState<string | null>(null);

    const { control, formState, handleSubmit, reset } = useForm<SettingsSchema>({
        values: data
        ? {
              firstName: data.firstName ?? '',
              lastName: data.lastName ?? '',
              username: data.username ?? '',
              pseudonym: data.pseudonym ?? '',
              date: data.date ?? '',
              signature: data.signature ?? '',
          }
        : {
              firstName: '',
              lastName: '',
              username: '',
              pseudonym: '',
              date: '',
              signature: '',
          },
        resolver: yupResolver(settingsSchema),
    });

    useEffect(() => {
        if (isSuccess && data) {
            reset({
                firstName: data.firstName ?? '',
                lastName: data.lastName ?? '',
                username: data.username ?? '',
                pseudonym: data.pseudonym ?? '',
                date: data.date ?? '',
                signature: data.signature ?? '',
            });
        }
    }, [isSuccess, data, reset]);

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
            form.append('lastName', values.lastName);
            form.append('username', values.username);
            form.append('pseudonym', values.pseudonym);
            form.append('date', values.date);
            form.append('signature', values.signature ?? '');

            if (localImageUri) {
                form.append('profileImage', {
                    uri: localImageUri,
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

    return (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
            <Card title="Картка профілю" edited={formState.isDirty} style={{ alignItems: 'center', gap: 24 }}>
                <TouchableOpacity onPress={pickImage}>
                    {imageSource ? (
                        <Image
                            source={imageSource}
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 45,
                                borderWidth: 2,
                                borderColor: COLORS.primary,
                            }}
                        />
                    ) : (
                        <Button style={styles.avatar} onPress={pickImage}>
                            <Text style={{ fontSize: 32 }}>
                                <Icon name="camera" size={40} />
                            </Text>
                        </Button>
                    )}
                </TouchableOpacity>
                <View style={{ alignItems: 'center', gap: 5 }}>
                    <Text style={styles.displayName}>John Doe</Text>
                    <Text style={styles.username}>@johndoe</Text>
                </View>
            </Card>

            <Card
                title="Особиста інформація"
                edited={formState.isDirty}
                style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 16,
                    gap: 12,
                }}
            >
                {settingFields.map(({ name, label, holder, type = 'text' }) => (
                    <Controller
                        key={name}
                        control={control}
                        name={name}
                        render={({ field, fieldState }) => (
                            <View style={{ gap: 4 }}>
                                <Input
                                    type={type}
                                    label={label}
                                    holder={holder}
                                    value={field.value ?? ''}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                />
                                {fieldState.error && (
                                    <Text style={{ fontSize: 15, color: COLORS.error }}>
                                        {fieldState.error.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    />
                ))}
            </Card>
            <Card edited={formState.isDirty} title="Варіанти підпису">
                <Text>Псевдонім автора</Text>
                <Text>Мій електронний підпис</Text>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: COLORS.grey,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: COLORS.primary,
    },
    displayName: {
        fontSize: 24,
        fontWeight: '700',
    },
    username: {
        fontSize: 16,
        fontWeight: '500',
    },
});
