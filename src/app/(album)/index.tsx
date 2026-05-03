import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@shared/ui';

export default function HomePage() {
    const router = useRouter();

    return (
        <View style={styles.page}>
            <Text style={styles.title}>WORLD IT</Text>
            <Text style={styles.subtitle}>Твій простір для фото та альбомів</Text>
            <View style={styles.actions}>
                <Button type="filled" onPress={() => router.push('/home/albums')}>
                    Перейти до альбомів
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#F8F7FA',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1D1B20',
        marginBottom: 8,
    },
    subtitle: {
        color: '#6B6773',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        maxWidth: 280,
    },
    actions: {
        width: '100%',
        maxWidth: 320,
    },
});
