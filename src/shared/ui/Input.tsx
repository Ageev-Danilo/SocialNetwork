import { useRef, useState } from 'react';
import { TextInput, View, Text } from 'react-native';
import Ripple from 'react-native-material-ripple';

import { BASE, COLORS } from '../consts';
import { InputProps } from '../types/shared.types';
import { Button } from './Button';

export function Input({
    type,
    label,
    holder = 'Enter text...',
    onChangeText,
    value,
    additional,
    ...props
}: InputProps) {
    const inputRef = useRef<TextInput>(null);
    const [isSecure, setIsSecure] = useState(type === 'pwd');

    const handlePress = () => {
        inputRef.current?.focus();
    };

    const toggleSecure = () => {
        setIsSecure(prev => !prev);
    };

    return (
        <View style={{ flex: 1, gap: 6 }}>
            {label && <Text style={BASE.inputLabel}>{label}</Text>}

            <View style={BASE.inputRow}>
                <Ripple style={BASE.inputContainer} onPress={handlePress} rippleOpacity={0.08}>
                    <TextInput
                        ref={inputRef}
                        style={BASE.input}
                        placeholder={holder}
                        placeholderTextColor="#999"
                        onChangeText={onChangeText}
                        value={value}
                        secureTextEntry={isSecure}
                        autoComplete={type === 'email' ? 'email' : 'name'}
                        {...props}
                    />
                </Ripple>
                {type === 'pwd' ? <Button type="icon" icon={isSecure ? 'visible' : 'hide'} iconSize={24} style={BASE.inputBtn} onPress={toggleSecure} /> : ''}
            </View>
        </View>
    );
}
