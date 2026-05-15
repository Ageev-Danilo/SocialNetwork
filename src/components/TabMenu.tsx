import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, usePathname } from 'expo-router';
import type { TabMenuProps, TabItem } from '@/shared/types/component.types';

const DEFAULT_TABS: TabItem[] = [
    { label: 'Особиста інформація', href: '/settings' },
    { label: 'Альбоми',             href: '/settings/albums' },
];

export function TabMenu({ type = 'fill', tabs = DEFAULT_TABS }: TabMenuProps) {
    const pathname = usePathname();

    return (
        <View style={styles.menu}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
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
    menu: {
        flexDirection:   'row',
        paddingHorizontal: 16,
        paddingTop:      8,
        backgroundColor: '#E9E5EE',
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
        color:      '#81818D',
        fontWeight: '500',
    },
    textActive: {
        color:      '#070A1C',
        fontWeight: '700',
    },
});