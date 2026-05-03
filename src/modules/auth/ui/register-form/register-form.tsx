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
            email:           '',
            password:        '',
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
                    email:    data.email,
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
                <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <View>
                            <Text style={styles.label}>Електронна пошта</Text>
                            <Input
                                type="email"
                                holder="you@example.com"
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
                <Controller
                    control={control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <View>
                            <Text style={styles.label}>Пароль</Text>
                            <Input
                                type="pwd"
                                holder="Введи пароль"
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
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                        <View>
                            <Text style={styles.label}>Підтверди пароль</Text>
                            <Input
                                type="pwd"
                                holder="Повтори пароль"
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
            </View>

            <View style={styles.footer}>
                <Button
                    type="fill"
                    text="Створити акаунт"
                    onPress={() => handleSubmit(onSubmit)()}
                    style={{ width: '100%', borderRadius: 14 }}
                />
            </View>
        </View>
    );
}