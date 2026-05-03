import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

interface Props {
    active: 'login' | 'signup';
}

export function AuthTabs({ active }: Props) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, active === 'signup' && styles.tabActive]}
                    onPress={() => router.push('/(auth)/signup')}
                >
                    <Text style={[styles.tabText, active === 'signup' && styles.tabTextActive]}>
                        Реєстрація
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, active === 'login' && styles.tabActive]}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={[styles.tabText, active === 'login' && styles.tabTextActive]}>
                        Авторизація
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems:      'center',
        paddingTop:      8,
        paddingBottom:   16,
    },
    tabs: {
        flexDirection: 'row',
        gap:           32, 
    },
    tab: {
        paddingVertical:   8,
        paddingHorizontal: 4,
    },
    tabActive: {
        borderBottomWidth: 3, 
        borderBottomColor: '#070A1C', 
    },
    tabText: {
        fontSize:   24, 
        color:      '#9CA3AF',
        fontWeight: '500',
    },
    tabTextActive: {
        color:      '#070A1C', 
        fontWeight: '700',
    },
});