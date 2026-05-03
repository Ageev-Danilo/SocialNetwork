import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VerifyForm } from '@/modules/auth';
import { AuthHeader } from '@/modules/auth/ui/auth-header/auth-header';

export default function VerifyScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <AuthHeader />
            <View style={styles.body}>
                <View style={styles.cardWrapper}>
                    <View style={styles.card}>
                        <VerifyForm />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: 'white' },
    body: { flex: 1, backgroundColor: '#F3F4F6' },
    cardWrapper: {
        flex:           1,
        alignItems:     'center',
        justifyContent: 'center',
        padding:        16,
    },
    card: {
        width:           343,
        height:          421,
        backgroundColor: 'white',
        borderRadius:    20,
        padding:         24,
        overflow:        'hidden',
    },
});