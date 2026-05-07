import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';

const TABS = [
    { label: 'Особиста інформація', href: '/home' },
    { label: 'Альбоми',             href: '/(album)/albums' },
];

export function TabMenu() {
    const pathname = usePathname();

    return (
        <View style={styles.container}>
            {TABS.map((tab) => {
                const isActive =
                    tab.href === '/home'
                        ? pathname === '/home'
                        : pathname === tab.href;

                return (
                    <Pressable
                        key={tab.href}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => router.push(tab.href as any)}
                        android_ripple={{ color: '#543C5215' }}
                    >
                        <Text style={[styles.text, isActive && styles.textActive]}>
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
    },
    tab: {
        paddingVertical: 12,
        marginRight: 16,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#543C52',
    },
    text: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    textActive: {
        color: '#543C52',
        fontWeight: '700',
    },
});