import { View, Image } from 'react-native';
import { usePathname, router } from 'expo-router';

import { Button } from '../shared/ui/Button';
import { Icon } from '../shared/ui/base/Icon';

import { BASE } from '@/shared/consts';
import { NavsProps } from '@/shared/types/shared.types';

export function Nav() {
    return (
        <View style={[BASE.nav, BASE.yc]}>
            <Image source={require('../assets/logo.png')} style={{ width: 145, height: 18 }} />
            <Navigations style={[BASE.yc, { gap: 10 }]} />
        </View>
    );
}

export function Navigations({ style }: NavsProps) {
    const pathname = usePathname();

    const isChat = pathname === '/chat' || pathname.startsWith('/chat/');
    const isFriends = pathname === '/friends' || pathname.startsWith('/friends/');

    const isVisible = !isChat && !isFriends;

    const handleLogout = () => {
        router.push('/(modal)/about');
    };

    return (
        <View style={style}>
            <Button type="outline">
                <Icon name="add" />
            </Button>
            {isVisible && (
                <Button type="outline">
                    <Icon name="settings" />
                </Button>
            )}
            <Button type="outline" onPress={handleLogout}>
                <Icon name="logout" />
            </Button>
        </View>
    );
}
