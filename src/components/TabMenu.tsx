import { View, Text, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { TabMenuProps, TabItem } from '@/shared/types/component.types';
import { Button } from '@/shared/ui';

const DEFAULT_TABS: TabItem[] = [
    { label: 'Особиста інформація', href: '/settings' },
    { label: 'Альбоми',             href: '/settings/albums' },
];

export function TabMenu({ type = 'fill', tabs = DEFAULT_TABS }: TabMenuProps) {
    const pathname = usePathname();

    return (
        <View style={[styles.menu, type === 'fill' && styles.container]}>
            {tabs.map((tab) => {
                const isActive =
                    pathname === tab.href ||
                    (tab.href === '/(album)/albums' && pathname.startsWith('/(album)'));

                return (
                    <Button
                        type="borderless"
                        key={tab.href}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => router.push(tab.href as any)}
                    >
                        <Text style={[styles.text, isActive && styles.textActive]}>
                            {tab.label}
                        </Text>
                    </Button>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        flexDirection:     'row',
        paddingHorizontal: 16,
    },
    container: {
        backgroundColor:   'white',
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
    },
    tab: {
        paddingVertical: 12,
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
        color:      '#543C52',
        fontWeight: '700',
    },
});