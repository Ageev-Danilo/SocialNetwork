import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { RegisterForm } from '@/modules/auth';

export default function SignupScreen() {
    const router = useRouter();
    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.card}>
                    <RegisterForm />
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                        <Text style={styles.link}>
                            Приєднуйся до World IT!{' '}
                            <Text style={styles.linkBold}>Увійти</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F3F4F6' },
    scroll: { flexGrow: 1, padding: 16 },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        gap: 16,
    },
    link: { textAlign: 'center', color: '#6B7280', fontSize: 14 },
    linkBold: { color: '#543C52', fontWeight: '600' },
});