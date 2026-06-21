import { useState } from 'react';
import {
    View, Text, ScrollView, Alert,
    ActivityIndicator, Image, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import Svg, { Path } from 'react-native-svg';
import { Icon } from '@/shared/ui';
import { COLORS, settingFields } from '@/shared/consts';
import {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
    useUpdateEmailMutation,
    useUpdatePasswordMutation,
} from '../../api';
import { settingsSchema, passwordSchema, emailSchema } from '../../model/schemas/settings-schema';
import type { SettingsSchema, PasswordSchema, EmailSchema } from '../../model/types/settings.types';


const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:3000';
const PASSWORD_MASK = '***********';

function buildAvatarUri(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('file')) return path;
    return `${BASE_URL}/media/thumbnail/${path}`;
}

function PencilButton({ onPress }: { onPress?: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.pencilBtn}>
            <Icon name="edit" size={20} />
        </TouchableOpacity>
    );
}

function CheckboxIcon({ checked }: { checked: boolean }) {
    return (
        <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
            <Path
                d="M14.125 1H2.875C1.83947 1 1 1.83947 1 2.875V14.125C1 15.1605 1.83947 16 2.875 16H14.125C15.1605 16 16 15.1605 16 14.125V2.875C16 1.83947 15.1605 1 14.125 1Z"
                stroke="#543C52"
                strokeWidth={2}
                strokeLinejoin="round"
            />
            {checked && (
                <Path
                    d="M12 5L6.75 11.25L4.5 8.75"
                    stroke="#543C52"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )}
        </Svg>
    );
}

export function SettingsForm() {
    const { data, isLoading } = useGetSettingsQuery();
    const [updateSettings] = useUpdateSettingsMutation();
    const [updateEmail] = useUpdateEmailMutation();
    const [updatePassword] = useUpdatePasswordMutation();

    const [localImageUri, setLocalImageUri] = useState<string | null>(null);
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [editingSignature, setEditingSignature] = useState(false);

    const [showDate, setShowDate] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [pseudonymChecked, setPseudonymChecked] = useState(true);
    const [signatureChecked, setSignatureChecked] = useState(true);

    const { control, handleSubmit, watch, formState } = useForm<SettingsSchema>({
        values: {
            firstName: data?.firstName ?? '',
            lastName: data?.lastName ?? '',
            pseudonym: data?.pseudonym ?? '',
            date: data?.date ?? '',
            signature: data?.signature ?? '',
        },
        resolver: yupResolver(settingsSchema),
    });

    const { control: pwdControl, handleSubmit: handlePwdSubmit, reset: resetPwd } =
        useForm<PasswordSchema>({
            defaultValues: { password: '' },
            resolver: yupResolver(passwordSchema),
        });

    const { control: emailControl, handleSubmit: handleEmailSubmit, formState: emailFormState } =
        useForm<EmailSchema>({
            values: { email: data?.email ?? '' },
            resolver: yupResolver(emailSchema),
        });

    const firstName = watch('firstName');
    const lastName = watch('lastName');
    const pseudonym = watch('pseudonym');
    const displayName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

    const { dirtyFields } = formState;
    const isPersonalDirty = (['firstName', 'lastName', 'date'] as (keyof SettingsSchema)[]).some(f => dirtyFields[f]);
    const isSignatureDirty = (['pseudonym', 'signature'] as (keyof SettingsSchema)[]).some(f => dirtyFields[f]);

    async function pickImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.8,
        });
        if (!result.canceled) setLocalImageUri(result.assets[0].uri);
    }

    async function onAvatarSave() {
        if (!localImageUri) {
            pickImage();
            return;
        }
        try {
            await updateSettings({
                firstName: data?.firstName ?? '',
                lastName: data?.lastName ?? '',
                pseudonym: data?.pseudonym ?? '',
                date: data?.date ?? '',
                signature: data?.signature ?? '',
                isImageSignature: data?.isImageSignature ?? false,
                isTextSignature: data?.isTextSignature ?? true,
                profileImage: localImageUri,
            }).unwrap();
            setLocalImageUri(null);
            Alert.alert('Готово', 'Фото збережено');
        } catch {
            Alert.alert('Помилка', 'Не вдалося зберегти фото');
        }
    }

    async function onPersonalSubmit(values: SettingsSchema, emailValue: string) {
        const personalChanged = isPersonalDirty;
        const emailChanged = emailFormState.isDirty;

        if (!personalChanged && !emailChanged) {
            setEditingPersonal(false);
            return;
        }

        try {
            if (personalChanged) {
                await updateSettings({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    pseudonym: data?.pseudonym ?? '',
                    date: values.date,
                    signature: data?.signature ?? '',
                    isImageSignature: data?.isImageSignature ?? false,
                    isTextSignature: data?.isTextSignature ?? true,
                    profileImage: data?.profileImage ?? undefined,
                }).unwrap();
            }

            if (emailChanged) {
                await updateEmail({ email: emailValue }).unwrap();
            }

            setEditingPersonal(false);
            Alert.alert('Готово', 'Дані збережено');
        } catch {
            Alert.alert('Помилка', 'Не вдалося зберегти');
        }
    }

    async function onPasswordSubmit(values: PasswordSchema) {
        if (!values.password) {
            setEditingPassword(false);
            return;
        }
        try {
            await updatePassword({ password: values.password }).unwrap();
            resetPwd();
            setEditingPassword(false);
            Alert.alert('Готово', 'Пароль змінено');
        } catch {
            Alert.alert('Помилка', 'Не вдалося змінити пароль');
        }
    }

    async function onSignatureSubmit(values: SettingsSchema) {
        if (!isSignatureDirty) {
            setEditingSignature(false);
            return;
        }
        try {
            await updateSettings({
                firstName: data?.firstName ?? '',
                lastName: data?.lastName ?? '',
                pseudonym: values.pseudonym,
                date: data?.date ?? '',
                signature: values.signature ?? '',
                isImageSignature: data?.isImageSignature ?? false,
                isTextSignature: data?.isTextSignature ?? true,
                profileImage: data?.profileImage ?? undefined,
            }).unwrap();
            setEditingSignature(false);
            Alert.alert('Готово', 'Підпис збережено');
        } catch {
            Alert.alert('Помилка', 'Не вдалося зберегти підпис');
        }
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={COLORS.primary} />
            </View>
        );
    }

    const avatarUri = localImageUri ?? buildAvatarUri(data?.profileImage);
    const imageSource = avatarUri ? { uri: avatarUri } : null;
    const signatureFieldNames: (keyof SettingsSchema)[] = ['pseudonym', 'signature'];

    return (
        <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Картка профілю</Text>
                    <PencilButton onPress={onAvatarSave} />
                </View>
                <View style={{ alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity onPress={pickImage}>
                        {imageSource ? (
                            <Image source={imageSource} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Icon name="camera" size={40} />
                            </View>
                        )}
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center', gap: 4 }}>
                        <Text style={styles.displayName}>{displayName || 'Не вказано'}</Text>
                        <Text style={styles.usernameText}>{pseudonym ? `@${pseudonym}` : '@pseudonym'}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Особиста інформація</Text>
                    <PencilButton onPress={() => {
                        if (editingPersonal) {
                            handleSubmit(values => {
                                handleEmailSubmit(emailValues => {
                                    onPersonalSubmit(values, emailValues.email);
                                })();
                            })();
                        } else {
                            setEditingPersonal(true);
                        }
                    }} />
                </View>

                <View style={{ gap: 12 }}>
                    {(['firstName', 'lastName'] as (keyof SettingsSchema)[]).map(name => {
                        const fieldMeta = settingFields.find(f => f.name === name)!;
                        return (
                            <Controller
                                key={name}
                                control={control}
                                name={name}
                                render={({ field }) => (
                                    <View style={{ gap: 4 }}>
                                        <Text style={styles.fieldLabel}>{fieldMeta.label}</Text>
                                        <View style={styles.narrowRow}>
                                            <TextInput
                                                style={[styles.narrowInput, editingPersonal && styles.inputActive]}
                                                value={field.value ?? ''}
                                                onChangeText={field.onChange}
                                                editable={editingPersonal}
                                                placeholder={fieldMeta.holder}
                                                placeholderTextColor="#81818D"
                                            />
                                        </View>
                                    </View>
                                )}
                            />
                        );
                    })}

                    <Controller
                        control={control}
                        name="date"
                        render={({ field }) => (
                            <View style={{ gap: 4 }}>
                                <Text style={styles.fieldLabel}>Дата народження</Text>
                                <View style={styles.narrowWithEye}>
                                    <View style={styles.narrowRow}>
                                        <TextInput
                                            style={[
                                                styles.narrowInput, 
                                                editingPersonal && showDate && styles.inputActive,
                                                !showDate && styles.passwordMasked  
                                            ]}
                                            value={showDate ? (field.value ?? '') : PASSWORD_MASK}  
                                            onChangeText={field.onChange}
                                            editable={editingPersonal && showDate}
                                            placeholder="дд.мм.рррр"
                                            placeholderTextColor="#81818D"
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => setShowDate(v => !v)} style={styles.outerEye}>
                                        <Icon name={showDate ? 'visible' : 'hide'} size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />

                    <Controller
                        control={emailControl}
                        name="email"
                        render={({ field, fieldState }) => (
                            <View style={{ gap: 4 }}>
                                <Text style={styles.fieldLabel}>Електронна адреса</Text>
                                <View style={styles.narrowWithEye}>
                                    <View style={styles.narrowRow}>
                                        <TextInput
                                            style={[
                                                styles.narrowInput, 
                                                editingPersonal && showEmail && styles.inputActive,
                                                !showEmail && styles.passwordMasked  
                                            ]}
                                            value={showEmail ? field.value : PASSWORD_MASK}  
                                            onChangeText={field.onChange}
                                            editable={editingPersonal && showEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            placeholder="you@example.com"
                                            placeholderTextColor="#81818D"
                                        />
                                    </View>
                                    <TouchableOpacity onPress={() => setShowEmail(v => !v)} style={styles.outerEye}>
                                        <Icon name={showEmail ? 'visible' : 'hide'} size={20} />
                                    </TouchableOpacity>
                                </View>
                                {editingPersonal && fieldState.error && (
                                    <Text style={styles.errorText}>{fieldState.error.message}</Text>
                                )}
                            </View>
                        )}
                    />
                </View>

                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Пароль</Text>
                    <PencilButton onPress={() => {
                        if (editingPassword) {
                            handlePwdSubmit(onPasswordSubmit)();
                        } else {
                            setEditingPassword(true);
                        }
                    }} />
                </View>

                <Controller
                    control={pwdControl}
                    name="password"
                    render={({ field, fieldState }) => (
                        <View style={{ gap: 4 }}>
                            <Text style={styles.fieldLabel}>Пароль</Text>
                            <View style={styles.fieldRow}>
                                <TextInput
                                    key={editingPassword ? `pwd-edit-${showPassword}` : 'pwd-view'}
                                    style={[
                                        styles.fieldInput,
                                        editingPassword && styles.inputActive,
                                        !editingPassword && styles.passwordMasked,
                                    ]}
                                    value={editingPassword ? field.value : PASSWORD_MASK}
                                    onChangeText={field.onChange}
                                    editable={editingPassword}
                                    secureTextEntry={editingPassword && !showPassword}
                                    placeholder="Введіть новий пароль"
                                    placeholderTextColor="#81818D"
                                />
                                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(v => !v)}>
                                    <Icon name={showPassword ? 'visible' : 'hide'} size={20} />
                                </TouchableOpacity>
                            </View>
                            {editingPassword && fieldState.error && (
                                <Text style={styles.errorText}>{fieldState.error.message}</Text>
                            )}
                        </View>
                    )}
                />
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Варіанти підпису</Text>
                    <PencilButton onPress={() => {
                        if (editingSignature) {
                            handleSubmit(onSignatureSubmit)();
                        } else {
                            setEditingSignature(true);
                        }
                    }} />
                </View>

                {editingSignature ? (
                    <View style={{ gap: 12 }}>
                        {settingFields
                            .filter(f => signatureFieldNames.includes(f.name))
                            .map(({ name, label, holder }) => (
                                <Controller
                                    key={name}
                                    control={control}
                                    name={name}
                                    render={({ field }) => (
                                        <View style={{ gap: 4 }}>
                                            <Text style={styles.fieldLabel}>{label}</Text>
                                            <View style={styles.fieldRow}>
                                                <TextInput
                                                    style={[styles.fieldInput, styles.inputActive]}
                                                    value={field.value ?? ''}
                                                    onChangeText={field.onChange}
                                                    placeholder={holder}
                                                    placeholderTextColor="#81818D"
                                                />
                                            </View>
                                        </View>
                                    )}
                                />
                            ))
                        }
                    </View>
                ) : (
                    <View style={{ gap: 16 }}>
                        <View style={{ gap: 8 }}>
                            <TouchableOpacity style={styles.checkRow} onPress={() => setPseudonymChecked(v => !v)}>
                                <CheckboxIcon checked={pseudonymChecked} />
                                <Text style={styles.fieldLabel}>Псевдонім автора</Text>
                            </TouchableOpacity>
                            <Text style={styles.signatureValue}>@{pseudonym}</Text>
                        </View>
                        <View style={{ gap: 8 }}>
                            <TouchableOpacity style={styles.checkRow} onPress={() => setSignatureChecked(v => !v)}>
                                <CheckboxIcon checked={signatureChecked} />
                                <Text style={styles.fieldLabel}>Мій електронний підпис</Text>
                            </TouchableOpacity>
                            <Image
                                source={require('@/assets/signature.png')}
                                style={styles.signatureImage}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const NARROW_WIDTH = 313;

const styles = StyleSheet.create({
    scroll: {
        paddingTop: 16,
        paddingBottom: 40,
        gap: 12,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#070A1C',
    },
    pencilBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#543C52',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
    },
    avatarPlaceholder: {
        backgroundColor: '#E9E5EE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    displayName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#070A1C',
    },
    usernameText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#070A1C',
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '400',
        color: '#81818D',
    },
    narrowWithEye: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    narrowRow: {
        width: NARROW_WIDTH,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CDCED2',
        borderRadius: 10,
        paddingHorizontal: 14,
        backgroundColor: '#fff',
        height: 42,
    },
    narrowInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        color: '#81818D',
        height: '100%',
        padding: 0,
    },
    outerEye: {
        padding: 4,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CDCED2',
        borderRadius: 10,
        paddingHorizontal: 14,
        backgroundColor: '#fff',
        height: 42,
    },
    fieldInput: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        color: '#81818D',
        height: '100%',  
        padding: 0,      
    },
    inputActive: {
        color: '#070A1C',
    },
    passwordMasked: { 
        fontSize: 16, 
        letterSpacing: 4,   
        includeFontPadding: false,  
        textAlignVertical: 'center', 
    },
    eyeBtn: {
        padding: 6,
    },
    errorText: {
        fontSize: 12,
        color: COLORS.error,
    },
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    signatureValue: {
        fontSize: 16,
        fontWeight: '400',
        color: '#070A1C',
    },
    signatureImage: {
        width: 131,
        height: 50,
        alignSelf: 'center',
    },
});