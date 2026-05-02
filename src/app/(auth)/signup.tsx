import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { RegisterForm } from '@/modules/auth';
import { AuthTabs } from '@/modules/auth/ui/auth-tabs/auth-tabs';
import { AuthHeader } from '@/modules/auth/ui/auth-header/auth-header';

export default function SignupScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <AuthHeader />
            <View style={styles.body}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.card}>
                        <AuthTabs active="signup" /> 
                        <RegisterForm />
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe:   { flex: 1, backgroundColor: 'white' },
    body:   { flex: 1, backgroundColor: '#F3F4F6' },
    scroll: { flexGrow: 1, padding: 16, justifyContent: 'center' },
    card:   {
        backgroundColor: 'white',
        borderRadius:    20,
        padding:         24,
        gap:             16,
    },
});