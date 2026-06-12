import { useState } from 'react';
import {
    View, Text, ScrollView, Alert,
    ActivityIndicator, Image, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { Button, Icon } from '@/shared/ui';
import { COLORS, settingFields } from '@/shared/consts';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../api';
import { settingsSchema, passwordSchema } from '../../model';
import type { SettingsSchema, PasswordSchema } from '../../model';
import { Card } from '@/components/Settings/Card';
import { SettingField } from './field';

const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3000';

export function SettingsForm() {
    const { data, isLoading }                         = useGetSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

    const [localImageUri,   setLocalImageUri]   = useState<string | null>(null);
    const [editingPassword, setEditingPassword] = useState(false);
    const [showPassword,    setShowPassword]    = useState(false);

    const { control, formState, handleSubmit, watch } = useForm<SettingsSchema>({
        values: {
            firstName: data?.firstName ?? '',
            lastName:  data?.lastName  ?? '',
            pseudonym: data?.pseudonym ?? '',
            date:      data?.date      ?? '',
            signature: data?.signature ?? '',
        },
        resolver: yupResolver(settingsSchema),
    });

    const { control: pwdControl, handleSubmit: handlePwdSubmit, reset: resetPwd, formState: pwdFormState } =
        useForm<PasswordSchema>({
            defaultValues: { password: '' },
            resolver: yupResolver(passwordSchema),
        });

    const firstName = watch('firstName');
    const lastName  = watch('lastName');

    const displayName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
    const pseudonym = watch('pseudonym');

    const { dirtyFields } = formState;

    const personalFields:  (keyof SettingsSchema)[] = ['firstName', 'lastName', 'date'];
    const signatureFields: (keyof SettingsSchema)[] = ['pseudonym', 'signature'];

    const isPersonalEdited  = personalFields.some(f  => dirtyFields[f]);
    const isSignatureEdited = signatureFields.some(f => dirtyFields[f]);
    const isProfileEdited   = !!localImageUri;

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:    ['images'],
            allowsEditing: true,
            quality:       0.8,
        });
        if (!result.canceled) setLocalImageUri(result.assets[0].uri);
    }

    async function onSubmit(values: SettingsSchema) {
        try {
            const form = new FormData();
            form.append('firstName', values.firstName);
            form.append('lastName', values.lastName);
            form.append('pseudonym', values.pseudonym);
            form.append('date', values.date);
            form.append('signature', values.signature ?? '');
            form.append('isImageSignature', String(data?.isImageSignature ?? false));
            form.append('isTextSignature', String(data?.isTextSignature  ?? true));

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

    async function onPasswordSubmit(values: PasswordSchema) {
        Alert.alert('Готово', 'Пароль змінено');
        resetPwd();
        setEditingPassword(false);
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
        <ScrollView contentContainerStyle={styles.scroll}>
            <Card
                title="Картка профілю"
                edited={isProfileEdited}
                onSave={handleSubmit(onSubmit)}
                style={{ alignItems: 'center', gap: 24 }}
            >
                <TouchableOpacity onPress={pickImage}>
                    {imageSource ? (
                        <Image source={imageSource} style={styles.avatar} />
                    ) : (
                        <View style={[styles.avatar, styles.avatarPlaceholder]}>
                            <Icon name="camera" size={40} />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={{ alignItems: 'center', gap: 5 }}>
                    <Text style={styles.displayName}>{displayName || 'Не вказано'}</Text>
                    <Text style={styles.usernameText}>{pseudonym ? `@${pseudonym}` : '@pseudonym'}</Text>
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

                <View style={styles.readonlyField}>
                    <Text style={styles.fieldLabel}>Електронна адреса</Text>
                    <View style={styles.fieldRow}>
                        <TextInput
                            style={styles.fieldInput}
                            value={data?.email ?? ''}
                            editable={false}
                            placeholder="you@example.com"
                            placeholderTextColor="#aaa"
                        />
                        <TouchableOpacity style={styles.eyeBtn}>
                            <Icon name="hide" size={18} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ marginTop: 8, gap: 4 }}>
                    <View style={styles.passwordHeader}>
                        <Text style={styles.fieldLabel}>Пароль</Text>
                        <Button
                            type="outline"
                            icon="edit"
                            iconSize={24}
                            text={editingPassword ? 'Зберегти' : ''}
                            style={editingPassword ? styles.saveBtnSpec : styles.editBtnSpec}
                            onPress={() => {
                                if (editingPassword) {
                                    handlePwdSubmit(onPasswordSubmit)();
                                } else {
                                    setEditingPassword(true);
                                }
                            }}
                        />
                    </View>

                    <View style={styles.fieldRow}>
                        <Controller
                            control={pwdControl}
                            name="password"
                            render={({ field, fieldState }) => (
                                <View style={{ flex: 1, gap: 4 }}>
                                    <TextInput
                                        style={styles.fieldInput}
                                        value={editingPassword ? field.value : '••••••••••'}
                                        onChangeText={field.onChange}
                                        editable={editingPassword} 
                                        secureTextEntry={!showPassword}
                                        placeholder={editingPassword ? "Введіть новий пароль" : "Пароль"}
                                        placeholderTextColor="#aaa"
                                    />
                                    {editingPassword && fieldState.error && (
                                        <Text style={{ fontSize: 12, color: COLORS.error, marginBottom: 4 }}>
                                            {fieldState.error.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.eyeBtn}
                            onPress={() => setShowPassword(v => !v)}
                        >
                            <Icon name={showPassword ? 'visible' : 'hide'} size={18} />
                        </TouchableOpacity>
                    </View>
                </View>
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
    scroll: {
        paddingTop:    16, 
        paddingBottom: 40,
        gap:           12,
    },

    avatar: {
        width:        90,
        height:       90,
        borderRadius: 45,
    },
    avatarPlaceholder: {
        backgroundColor: '#E9E5EE',
        justifyContent:  'center',
        alignItems:      'center',
    },
    displayName: {
        fontSize:   24,
        fontWeight: '700',
        color:      '#1a1a1a',
    },
    usernameText: {
        fontSize:   16,
        fontWeight: '500',
        color:      '#81818D',
    },

    readonlyField: { gap: 4 },
    fieldLabel:    { fontSize: 14, fontWeight: '500', color: '#1a1a1a' },
    fieldRow: {
        flexDirection:  'row',
        alignItems:     'center',
        borderWidth:    1,
        borderColor:    '#CDCED2',
        borderRadius:   10,
        paddingHorizontal: 14,
        backgroundColor: '#fff',
    },
    fieldInput: {
        flex:       1,
        height:     46,
        fontSize:   15,
        color:      '#1a1a1a',
    },
    eyeBtn: {
        padding: 8,
    },

    passwordHeader: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
        marginBottom:   4,
    },
    editBtnSpec: {
        width:  40,
        height: 40,
    },
    saveBtnSpec: {
        flexDirection: 'row',
        alignItems:    'center',
        backgroundColor: '#E9E5EE',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius:  20,
        gap:           8,
    },
});