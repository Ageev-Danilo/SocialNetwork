import { useRef } from 'react';
import { TextInput } from 'react-native';
import Ripple from 'react-native-material-ripple';

import { BASE } from '../consts';
import { InputProps } from '../types/types';


export function Input({ type, holder = 'Enter text...', onChangeText, value, ...props }: InputProps) {
    const inputRef = useRef<TextInput>(null);

    const handlePress = () => {
        inputRef.current?.focus();
    };

    return (
        <Ripple onPress={handlePress} rippleOpacity={0.08}>
            <TextInput
                ref={inputRef}
                style={BASE.input}
                placeholder={holder}
                placeholderTextColor="#999"
                onChangeText={onChangeText}
                value={value}
                secureTextEntry={type === 'pwd' ? true : false}
                autoComplete={type === 'email' ? 'email' : 'name'}
                {...props}
            />
        </Ripple>
    );
}