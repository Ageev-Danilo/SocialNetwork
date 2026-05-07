import { View, Text } from 'react-native';
import { Controller, FieldValues } from 'react-hook-form';
import { Input } from '@/shared/ui';
import { COLORS } from '@/shared/consts';
import { SettingFieldProps } from '@/shared/types/modules.types';

export function SettingField<T extends FieldValues>({
    control,
    name,
    label,
    holder,
    type = 'text',
}: SettingFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <View style={{ gap: 4 }}>
                    <Input
                        type={type}
                        label={label}
                        holder={holder}
                        value={field.value ?? ''}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                    />

                    {fieldState.error && (
                        <Text style={{ fontSize: 15, color: COLORS.error }}>
                            {fieldState.error.message}
                        </Text>
                    )}
                </View>
            )}
        />
    );
}
