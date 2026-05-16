import { useState } from 'react';
import {
    View, Text, ScrollView, Alert,
    ActivityIndicator, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { Button, Icon } from '@/shared/ui';
import { COLORS, settingFields } from '@/shared/consts';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../api';
import { settingsSchema } from '../../model';
import type { SettingsSchema } from '../../model';
import { Card } from '@/components/Settings/Card';
import { SettingField } from './field';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3000';

export function SettingsForm() {
    const { data, isLoading } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [localImageUri, setLocalImageUri] = useState<string | null>(null);

    const { control, formState, handleSubmit, watch } = useForm<SettingsSchema>({
        values: {
            firstName: data?.firstName ?? '',
            lastName:  data?.lastName  ?? '',
            username:  data?.username  ?? '',
            pseudonym: data?.pseudonym ?? '',
            date:      data?.date      ?? '',
            signature: data?.signature ?? '',
        },
        resolver: yupResolver(settingsSchema),
    });

    const firstName = watch('firstName');
    const lastName  = watch('lastName');
    const username  = watch('username');

    const displayName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

    const { dirtyFields } = formState;

    const personalFields:  (keyof SettingsSchema)[] = ['firstName', 'lastName', 'username', 'date'];
    const signatureFields: (keyof SettingsSchema)[] = ['pseudonym', 'signature'];

    const isPersonalEdited  = personalFields.some(f  => dirtyFields[f]);
    const isSignatureEdited = signatureFields.some(f => dirtyFields[f]);
    const isProfileEdited   = !!localImageUri;

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality:       0.8,
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
            setLocalImageUri(null);
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
                onSave={handleSubmit(onSubmit)}
                style={{ alignItems: 'center', gap: 24 }}
            >
                <TouchableOpacity onPress={pickImage}>
                    {imageSource ? (
                        <Image
                            source={imageSource}
                            style={styles.avatar}
                        />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Icon name="camera" size={40} />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={{ alignItems: 'center', gap: 5 }}>
                    <Text style={styles.displayName}>
                        {displayName || 'Не вказано'}
                    </Text>
                    <Text style={styles.username}>
                        {username ? `@${username}` : '@username'}
                    </Text>
                </View>
            </Card>

            <Card
                title="Особиста інформація"
                edited={isPersonalEdited}
                onSave={handleSubmit(onSubmit)}
            >
                {settingFields
                    .filter(f => personalFields.includes(f.name))
                    .map(({ name, label, holder, type = 'text' }) => (
                        <SettingField
                            key={name}
                            control={control}
                            name={name}
                            label={label}
                            holder={holder}
                            type={type}
                        />
                    ))
                }
            </Card>

            <Card
                title="Варіанти підпису"
                edited={isSignatureEdited}
                onSave={handleSubmit(onSubmit)}
            >
                {settingFields
                    .filter(f => signatureFields.includes(f.name))
                    .map(({ name, label, holder, type = 'text' }) => (
                        <SettingField
                            key={name}
                            control={control}
                            name={name}
                            label={label}
                            holder={holder}
                            type={type}
                        />
                    ))
                }
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width:        90,
        height:       90,
        borderRadius: 45,
        borderWidth:  2,
        borderColor:  COLORS.primary,
    },
    avatarPlaceholder: {
        backgroundColor: COLORS.grey,
        justifyContent:  'center',
        alignItems:      'center',
    },
    displayName: {
        fontSize:   24,
        fontWeight: '700',
        color:      '#1a1a1a',
    },
    username: {
        fontSize:   16,
        fontWeight: '500',
        color:      '#81818D',
    },
});