import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';

import { Button, Input } from '@/shared/ui';
import { registerSchema } from '../../model/schemas';
import { sendVerificationEmail } from '../../services/email.service';
import type { RegisterSchema } from '../../model';
import { styles } from './register-form.styles';

export function RegisterForm() {
    const router = useRouter();

    const { control, handleSubmit } = useForm<RegisterSchema>({
        defaultValues: {
            email: '',
            username: '',
            name: '',
            surname: '',
            password: '',
            confirmPassword: '',
        },
        resolver: yupResolver(registerSchema),
    });

    async function onSubmit(data: RegisterSchema) {
        try {
            const code = await sendVerificationEmail(data.email);
            router.push({
                pathname: '/(auth)/verify',
                params: {
                    email: data.email,
                    username: data.username,
                    name: data.name,
                    surname: data.surname,
                    password: data.password,
                    code,
                },
            });
        } catch (e) {
            console.error('Email send error:', e);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Приєднуйся до World IT</Text>

            <View style={styles.fields}>
                {(
                    [
                        {
                            name: 'email',
                            label: 'Електронна пошта',
                            type: 'email',
                            holder: 'you@example.com',
                        },
                        {
                            name: 'username',
                            label: "Ім'я користувача",
                            type: 'text',
                            holder: 'username',
                        },
                        { name: 'name', label: "Ім'я", type: 'text', holder: "Введи ім'я" },
                        {
                            name: 'surname',
                            label: 'Прізвище',
                            type: 'text',
                            holder: 'Введи прізвище',
                        },
                        { name: 'password', label: 'Пароль', type: 'pwd', holder: 'Введи пароль' },
                        {
                            name: 'confirmPassword',
                            label: 'Підтверди пароль',
                            type: 'pwd',
                            holder: 'Повтори пароль',
                        },
                    ] as const
                ).map(({ name, label, type, holder }) => (
                    <Controller
                        key={name}
                        control={control}
                        name={name}
                        render={({ field, fieldState }) => (
                            <View>
                                <Text style={styles.label}>{label}</Text>
                                <Input
                                    type={type}
                                    holder={holder}
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                />
                                {fieldState.error && (
                                    <Text style={styles.error}>{fieldState.error.message}</Text>
                                )}
                            </View>
                        )}
                    />
                ))}
            </View>

            <View style={styles.footer}>
                <Button type="fill" text="Продовжити" onPress={() => handleSubmit(onSubmit)()} />
            </View>
        </View>
    );
}
