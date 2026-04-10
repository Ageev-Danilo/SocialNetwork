import { View, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button, Input } from '@/shared/ui';
import { loginSchema } from '../../model/schemas';
import { useLoginMutation } from '../../api';
import { useUserContext } from '../../context';
import type { LoginSchema } from '../../model';
import { styles } from './login-form.styles';

export function LoginForm() {
    const router = useRouter();
    const { setToken } = useUserContext();
    const [login, { isLoading }] = useLoginMutation();

    const { control, handleSubmit } = useForm<LoginSchema>({
        defaultValues: { email: '', password: '' },
        resolver: yupResolver(loginSchema),
    });

    async function onSubmit(data: LoginSchema) {
        try {
            const result = await login(data).unwrap();
            await AsyncStorage.setItem('token', result.token);
            setToken(result.token);
            router.replace('/');
        } catch (e) {
            console.error('Login error:', e);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Раді тебе знову бачити!</Text>

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
                                <Text style={styles.error}>
                                    {fieldState.error.message}
                                </Text>
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
                                <Text style={styles.error}>
                                    {fieldState.error.message}
                                </Text>
                            )}
                        </View>
                    )}
                />
            </View>

            <View style={styles.footer}>
                <Button
                    type="fill"
                    text={isLoading ? 'Завантаження...' : 'Увійти'}
                    onPress={handleSubmit(onSubmit)}
                />
            </View>
        </View>
    );
}