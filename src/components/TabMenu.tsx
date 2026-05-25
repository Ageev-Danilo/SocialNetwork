import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, usePathname } from 'expo-router';
import type { TabMenuProps, TabItem } from '@/shared/types/component.types';

const TABS: TabItem[] = [
    { label: 'Особиста інформація', href: '/home' },
    { label: 'Альбоми',             href: '/(album)/albums' },
];


export function TabMenu({ type = 'fill', tabs = TABS }: TabMenuProps) {
    const pathname = usePathname();

    return (
        <View style={styles.container}>
            {TABS.map((tab) => {
                const isActive = pathname === tab.href ||
                    (tab.href === '/(album)/albums' && pathname.startsWith('/(album)'));

                return (
                    <TouchableOpacity
                        key={tab.href}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => { if (!isActive) router.push(tab.href as any); }}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.text, isActive && styles.textActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection:     'row',
        backgroundColor:   'transparent',  
        paddingHorizontal: 16,
    },
    tab: {
        paddingVertical: 10,
        marginRight:     16,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#543C52',
    },
    text: {
        fontSize:   14,
        color:      '#999',
        fontWeight: '700',
    },
    textActive: {
        color:      '#070A1C',
        fontWeight: '700',
    },
});