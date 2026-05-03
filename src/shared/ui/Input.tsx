import { useRef } from 'react';
import { TextInput, View, Text } from 'react-native';
import Ripple from 'react-native-material-ripple';

import { BASE, COLORS } from '../consts';
import { InputProps } from '../types/shared.types';

export function Input({
    type,
    label,
    holder = 'Enter text...',
    onChangeText,
    value,
    ...props
}: InputProps) {
    const inputRef = useRef<TextInput>(null);

    const handlePress = () => {
        inputRef.current?.focus();
    };

    return (
        <View style={{ gap: 6 }}>
            {label && (
                <Text style={{ fontSize: 16, color: COLORS.black, opacity: 0.6 }}>{label}</Text>
            )}

            <Ripple onPress={handlePress} rippleOpacity={0.08}>
                <TextInput
                    ref={inputRef}
                    style={BASE.input}
                    placeholder={holder}
                    placeholderTextColor="#999"
                    onChangeText={onChangeText}
                    value={value}
                    secureTextEntry={type === 'pwd'}
                    autoComplete={type === 'email' ? 'email' : 'name'}
                    {...props}
                />
            </Ripple>
        </View>
    );
}
