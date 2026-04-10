import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginForm } from '@/modules/auth';

export default function LoginScreen() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.card}>
                <LoginForm />
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                    <Text style={styles.link}>
                        Немає акаунту?{' '}
                        <Text style={styles.linkBold}>Зареєструватись</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F3F4F6' },
    card: {
        flex: 1,
        backgroundColor: 'white',
        margin: 16,
        borderRadius: 20,
        padding: 24,
        gap: 16,
    },
    link: { textAlign: 'center', color: '#6B7280', fontSize: 14 },
    linkBold: { color: '#543C52', fontWeight: '600' },
});