import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { TabMenuProps, TabItem } from '@/shared/types/component.types';
import { Button } from '@/shared/ui';

const DEFAULT_TABS: TabItem[] = [
    { label: 'Особиста інформація', href: '/home' },
    { label: 'Альбоми', href: '/home/albums' },
];

export function TabMenu({ type = 'fill', tabs = DEFAULT_TABS }: TabMenuProps) {
    const pathname = usePathname();

    return (
        <View style={[type === 'fill' ? styles.container : '', styles.menu]}>
            {tabs.map(tab => {
                const isActive =
                    tab.href === '/home' ? pathname === '/home' : pathname === tab.href;

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
        flexDirection: 'row',
        paddingHorizontal: 16,
    },
    container: {
        backgroundColor: 'white',
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
        fontSize: 16,
        color: '#999',
        fontWeight: '500',
    },
    textActive: {
        color: '#543C52',
        fontWeight: '700',
    },
});
