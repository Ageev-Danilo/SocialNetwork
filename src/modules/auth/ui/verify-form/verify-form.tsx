import { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/shared/ui';
import { useRegisterMutation } from '../../api';
import { useUserContext } from '../../context';
import { styles } from './verify-form.styles';

const CODE_LENGTH = 6;

export function VerifyForm() {
    const router  = useRouter();
    const params  = useLocalSearchParams<{
        email:    string;
        password: string;
        code:     string;
    }>();
    const { setToken }              = useUserContext();
    const [register, { isLoading }] = useRegisterMutation();
    const [digits, setDigits]       = useState<string[]>(Array(CODE_LENGTH).fill(''));
    const [error, setError]         = useState<string | null>(null);
    const inputs = useRef<(TextInput | null)[]>([]);

    function handleChange(text: string, index: number) {
        if (!/^\d?$/.test(text)) return;
        const next = [...digits];
        next[index] = text;
        setDigits(next);
        setError(null);
        if (text && index < CODE_LENGTH - 1) {
            inputs.current[index + 1]?.focus();
        }
    }

    function handleKeyPress(key: string, index: number) {
        if (key === 'Backspace' && !digits[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    }

    async function onConfirm() {
        const entered = digits.join('');
        if (entered.length < CODE_LENGTH) { setError('Введи всі 6 цифр'); return; }
        if (entered !== params.code) {
            setError('Невірний код. Спробуй ще раз');
            setDigits(Array(CODE_LENGTH).fill(''));
            inputs.current[0]?.focus();
            return;
        }
        try {
            const result = await register({
                email:    params.email,
                password: params.password,
                username: params.email.split('@')[0], 
                name:     '',
                surname:  '',
            }).unwrap();
            await AsyncStorage.setItem('token', result.token);
            setToken(result.token);
            router.replace('/');
        } catch {
            Alert.alert('Помилка', 'Не вдалося зареєструватись');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Підтвердження пошти</Text>
            <Text style={styles.subtitle}>
                Ми надіслали 6-значний код на вашу пошту{'\n'}
                <Text style={{ fontWeight: '600', color: '#070A1C' }}>{params.email}</Text>
                {'\n'}Введіть його нижче, щоб підтвердити акаунт
            </Text>

            <Text style={styles.codeLabel}>Код підтвердження</Text>
            <View style={styles.codeContainer}>
                {digits.map((digit, i) => (
                    <View key={i} style={[styles.codeBox, digit ? styles.codeBoxFilled : null]}>
                        <Text style={[styles.underscore, digit ? styles.underscoreActive : null]}>_</Text>
                        
                        <TextInput
                            ref={(r) => { inputs.current[i] = r; }}
                            style={styles.codeInput}
                            value={digit}
                            onChangeText={(t) => handleChange(t, i)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    </View>
                ))}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.footer}>
                <Button
                    type="fill"
                    text={isLoading ? 'Реєстрація...' : 'Підтвердити'}
                    onPress={onConfirm}
                    style={{ width: '100%', borderRadius: 14 }}
                />
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.resend}>Назад</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}