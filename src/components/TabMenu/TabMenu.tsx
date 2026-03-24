import { View, Text, Pressable } from 'react-native';
import { router, usePathname } from 'expo-router';

import { styles } from './TabMenu.styles';
import { TABS } from '@/shared/consts';

import { Button } from '@/shared/ui';


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
                    <Button
                        type='borderless'
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