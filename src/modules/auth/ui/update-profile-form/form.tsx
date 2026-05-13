import {
    useLazyGetUsernameSuggestionsQuery,
    useUpdateProfileMutation,
} from '../../api/auth-api';
import { updateProfileSchema, UpdateProfileSchema } from '../../model';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { View, Text } from 'react-native';
import { Button, Input } from '@/shared/ui';
import { router } from 'expo-router';


export function UpdateProfileForm({ styles }: { styles: any }) {
    const [updateProfile] = useUpdateProfileMutation();

    const [getUsernameSuggestions, { isLoading }] =
        useLazyGetUsernameSuggestionsQuery();

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<UpdateProfileSchema>({
        defaultValues: {
            username: '',
            pseudonym: '',
        },
        resolver: yupResolver(updateProfileSchema),
        mode: 'onChange',
    });

    async function onSuggestion() {
        try {
            const res = await getUsernameSuggestions().unwrap();

            setValue('username', res.username, {
                shouldValidate: true,
            });

            setValue('pseudonym', res.pseudonym, {
                shouldValidate: true,
            });
        } catch (e) {
            console.error('Suggestion error:', e);
        }
    }

    async function onSubmit(data: UpdateProfileSchema) {
        try {
            await updateProfile(data).unwrap();
            router.back();
        } catch (e) {
            console.error('Update profile error:', e);
        }
    }

    return (
        <>
            <View style={styles.content}>
                <Controller
                    control={control}
                    name="pseudonym"
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Псевдонім автора"
                            placeholder="Введіть псевдонім автора"
                            value={value}
                            onChangeText={onChange}
                            error={errors.pseudonym}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, value } }) => (
                        <View>
                            <Input
                                label="Ім’я користувача"
                                placeholder="@"
                                value={value}
                                onChangeText={onChange}
                                error={errors.username}
                            />

                            <View style={styles.suggested}>
                                <Text style={styles.suggested}>
                                    Або оберіть:{' '}
                                    <Text
                                        style={styles.suggestedText}
                                        onPress={onSuggestion}
                                    >
                                        (Запропоновані варіанти відповідно до
                                        Ім’я та Прізвища)
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    )}
                />
            </View>

            <View style={styles.next}>
                <Button
                    text={isLoading ? 'Завантаження...' : 'Продовжити'}
                    onPress={() => handleSubmit(onSubmit)()}
                />
            </View>
        </>
    );
}