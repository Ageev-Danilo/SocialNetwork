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
import { SettingField } from './field';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3000';

export function SettingsForm() {
    const { data, isLoading, isSuccess } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [localImageUri, setLocalImageUri] = useState<string | null>(null);

    const { control, formState, handleSubmit, reset, watch } = useForm<SettingsSchema>({
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

    const firstName = watch('firstName');
const lastName = watch('lastName');
const username = watch('username');
const displayName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

    const { dirtyFields } = formState;
    const personalFields: (keyof SettingsSchema)[] = ['firstName', 'lastName', 'username', 'date'];
    const signatureFields: (keyof SettingsSchema)[] = ['pseudonym', 'signature'];

    const isPersonalEdited = personalFields.some(field => dirtyFields[field]);
    const isSignatureEdited = signatureFields.some(field => dirtyFields[field]);
    const isProfileEdited = !!localImageUri;

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
            <Card
                title="Картка профілю"
                edited={isProfileEdited}
                style={{ alignItems: 'center', gap: 24 }}
            >
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
                    <Text style={styles.displayName}>{displayName || 'Not found'}</Text>
                    <Text style={styles.username}>{username ? `@${username}` : '@username'}</Text>
                </View>
            </Card>


            <Card
                title="Особиста інформація"
                edited={isPersonalEdited}
                style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 16,
                    gap: 12,
                }}
            >
                {settingFields.map(({ name, label, holder, type = 'text' }) => (
                    <SettingField
                        key={name}
                        control={control}
                        name={name}
                        label={label}
                        holder={holder}
                        type={type}
                    />
                ))}
            </Card>

            
            <Card edited={isSignatureEdited} title="Варіанти підпису">
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
