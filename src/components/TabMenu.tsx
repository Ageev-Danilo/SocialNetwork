import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';
import { TabMenuProps, TabItem } from '@/shared/types/component.types';
import { Button } from '@/shared/ui';

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
    container: {
        flexDirection:     'row',
        backgroundColor:   'transparent',  
        paddingHorizontal: 16,
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
