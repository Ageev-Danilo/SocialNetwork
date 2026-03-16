import { View, Text, Image } from 'react-native';
import Button from '../Button';
import { Icon } from './Icon';
import { BASE } from '@/shared/consts';
import { NavsProps } from '@/shared/types/types';


export function Nav({ route }: NavsProps) {
    return (
        <View style={[BASE.nav, BASE.yc]}>
            <Image source={require('../../../assets/logo.png')} style={{ width: 145, height: 18 }} />
            <Navigations route={route} style={[BASE.yc, { gap: 10 }]} />
        </View>
    )
}

export function Navigations({ route, style }: NavsProps) {
    const isAuth = route?.name?.includes('(auth)');

    //if (isAuth) return null;

    return (
        <View style={style}>
            <Button type='outline'>
                <Icon name='add' />
            </Button>
            <Button type='outline'>
                <Icon name='settings' />
            </Button>
            <Button type='outline' text='OK'>
                <Icon name='logout' />
            </Button>
        </View>
    );
}

export function BottomBar() {
    return (
        <View>
            <Button type='icon'>
                
            </Button>
            <Button type='icon'>
                
            </Button>
            <Button type='icon'>
                
            </Button>
            <Button type='icon'>
                
            </Button>
        </View>
    )
}