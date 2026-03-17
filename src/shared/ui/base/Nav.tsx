import { View, Text, Image } from 'react-native';
import { usePathname, router } from 'expo-router';

import { Button, TabBtn } from '../Button';
import { Icon } from './Icon';

import { BASE } from '@/shared/consts';
import { NavsProps } from '@/shared/types/types';


export function Nav() {
    return (
        <View style={[BASE.nav, BASE.yc]}>
            <Image source={require('../../../assets/logo.png')} style={{ width: 145, height: 18 }} />
            <Navigations style={[BASE.yc, { gap: 10 }]} />
        </View>
    )
}

export function Navigations({ style }: NavsProps) {
    const pathname = usePathname();

    const handleLogout = () => {
        router.push('(auth)/login');
    }

    return (
        <View style={style}>
            <Button type='outline'>
                <Icon name='add' />
            </Button>
            <Button type='outline'>
                <Icon name='settings' />
            </Button>
            <Button type='outline' onPress={handleLogout}>
                <Icon name='logout' />
            </Button>
        </View>
    );
}

export function BottomBar() {
    return (
        <View style={[BASE.center, BASE.bottomBar]}>
            <TabBtn icon="home" label="Головна" href="/home" />
            <TabBtn icon="img" label="Мої публікації" href="/posts" />
            <TabBtn icon="group" label="Друзі" href="/friends" />
            <TabBtn icon="chat" label="Чати" href="/chat" />
        </View>
    )
}