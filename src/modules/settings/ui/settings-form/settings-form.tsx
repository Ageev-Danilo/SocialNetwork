import { useEffect } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Button } from '@/shared/ui';
import { BASE, COLORS } from '@/shared/consts';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../api';
import { settingsSchema } from '../../model';
import type { SettingsSchema } from '../../model';

export function SettingsForm() {
    const { data, isLoading } = useGetSettingsQuery();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

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

    async function onSubmit(values: SettingsSchema) {
        try {
            await updateSettings({
                ...values,
                signature:    values.signature ?? '',
                profileImage: '',
            }).unwrap();
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

    const fields: {
        name: keyof SettingsSchema;
        label: string;
        holder: string;
        type?: 'text' | 'email' | 'pwd';
    }[] = [
        { name: 'firstName', label: "Ім'я",       holder: "Введи ім'я" },
        { name: 'lastName',  label: 'Прізвище',   holder: 'Введи прізвище' },
        { name: 'username',  label: 'Нікнейм',    holder: '@username' },
        { name: 'pseudonym', label: 'Псевдонім',  holder: 'Введи псевдонім' },
        { name: 'date',      label: 'Дата народження', holder: 'дд.мм.рррр' },
        { name: 'signature', label: 'Підпис',     holder: 'Введи підпис' },
    ];

    return (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>

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