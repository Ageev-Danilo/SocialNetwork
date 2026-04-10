import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VerifyForm } from '@/modules/auth';

export default function VerifyScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.card}>
                <VerifyForm />
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
    },
});