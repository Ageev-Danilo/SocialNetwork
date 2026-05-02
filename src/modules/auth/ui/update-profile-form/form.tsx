import { useUpdateProfileMutation } from '../../api/auth-api';
import { updateProfileSchema, UpdateProfileSchema } from '../../model';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Input } from '@/shared/ui';

export function UpdateProfileForm({ styles }: { styles: any }) {
    const [updateProfile] = useUpdateProfileMutation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateProfileSchema>({
        defaultValues: {
            username: '',
            pseudonym: '',
        },
        resolver: yupResolver(updateProfileSchema),
        mode: 'onChange',
    });

    async function onSubmit(data: UpdateProfileSchema) {
        try {
            await updateProfile(data).unwrap();
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
                        <View style={styles.container}>
                            <Text style={styles.label}>Псевдонім автора</Text>
                            <Input
                                placeholder="Введіть псевдонім автора"
                                value={value}
                                onChangeText={onChange}
                            />
                            {errors.pseudonym && <Text style={styles.error}>{errors.pseudonym.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="username"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.container}>
                            <Text style={styles.label}>Ім’я користувача</Text>
                            <Input placeholder="@" value={value} onChangeText={onChange} />
                            {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

                            <View style={styles.suggested}>
                                <Text style={styles.suggested}>
                                    Або оберіть:{' '}
                                    <Text style={styles.suggestedText}>
                                        (Запропоновані варіанти відповідно до Ім’я та Прізвища)
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    )}
                />
            </View>
            <View style={styles.next}>
                <Button text="Продовжити" onPress={handleSubmit(onSubmit)} />
            </View>
        </>
    );
}
