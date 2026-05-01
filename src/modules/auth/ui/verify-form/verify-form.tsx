import { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '@/shared/ui';
import { useRegisterMutation } from '../../api';
import { useUserContext } from '../../context';
import { sendVerificationEmail } from '../../services/email.service';
import { styles } from './verify-form.styles';

const CODE_LENGTH = 6;  

export function VerifyForm() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        email:    string;
        username: string;
        name:     string;
        surname:  string;
        password: string;
        code:     string;
    }>();
    const { setToken } = useUserContext();
    const [register, { isLoading }] = useRegisterMutation();

    const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
    const [error, setError]   = useState<string | null>(null);
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
        const enteredCode = digits.join('');
        if (enteredCode.length < CODE_LENGTH) {
            setError('Введи всі 6 цифр');
            return;
        }
        if (enteredCode !== params.code) {
            setError('Невірний код. Спробуй ще раз');
            setDigits(Array(CODE_LENGTH).fill(''));
            inputs.current[0]?.focus();
            return;
        }
        try {
            const result = await register({
                email:    params.email,
                username: params.username,
                name:     params.name,
                surname:  params.surname,
                password: params.password,
            }).unwrap();
            await AsyncStorage.setItem('token', result.token);
            setToken(result.token);
            router.replace('/');
        } catch (e) {
            console.error('Register error:', e);
            Alert.alert('Помилка', 'Не вдалося зареєструватись');
        }
    }

    async function onResend() {
        try {
            const newCode = await sendVerificationEmail(params.email);
            router.setParams({ code: newCode });
            setDigits(Array(CODE_LENGTH).fill(''));
            inputs.current[0]?.focus();
            Alert.alert('Готово', 'Новий код надіслано');
        } catch {
            Alert.alert('Помилка', 'Не вдалося надіслати код');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Підтвердження пошти</Text>
            <Text style={styles.subtitle}>
                Ми надіслали 6-значний код на{'\n'}
                <Text style={{ fontWeight: '600', color: '#070A1C' }}>
                    {params.email}
                </Text>
            </Text>

            <View style={styles.codeContainer}>
                {digits.map((digit, i) => (
                    <TextInput
                        key={i}
                        ref={(el) => { inputs.current[i] = el; }}
                        style={[
                            styles.codeInput,
                            digit ? styles.codeInputFilled : null,
                        ]}
                        value={digit}
                        onChangeText={(text) => handleChange(text, i)}
                        onKeyPress={({ nativeEvent }) =>
                            handleKeyPress(nativeEvent.key, i)
                        }
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                    />
                ))}
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.footer}>
                <Button
                    type="fill"
                    text={isLoading ? 'Реєстрація...' : 'Підтвердити'}
                    onPress={onConfirm}
                />
                <TouchableOpacity onPress={onResend}>
                    <Text style={styles.resend}>Надіслати код знову</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}