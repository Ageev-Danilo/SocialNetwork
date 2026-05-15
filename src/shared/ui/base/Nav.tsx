// import { View, Text, Image } from 'react-native';
// import { NativeStackHeaderProps } from '@react-navigation/native-stack';
// import { Icon } from './Icon';


// export default function Navigations({ route }: NativeStackHeaderProps) {
//     return (
//         <View>
//             <Icon name='add' size={30} />
//         </View>
//     );
// }
import { View, Text, Image } from 'react-native';
import { Icon, Button } from '@shared/ui';
// import { Button } from './Button';
// import { Icon } from './Icon';
import { NavsProps } from '@/shared/types/types';


export function Nav({ route }: NavsProps) {
    return (
        <Navigations route={route} />
    )
}

export function Navigations({ route }: NavsProps) {
    const isAuth = route?.name?.includes('(auth)');

    if (isAuth) return null;

    return (
        <View>
            <Button type='outlined'>
                <Icon name='add' size={20} />
            </Button>
            <Button type='outlined'>
                <Icon name='setting' size={20} />
            </Button>
            <Button type='outlined'>
                <Icon name='logout' size={20} />
            </Button>
        </View>
    );
}

export function Bottom() {
    return (
        <View>
            <Button type='icon'>
                <Icon name='home' size={20} />
            </Button>
            <Button type='icon'>
                <Icon name='img' size={20} />
            </Button>
            <Button type='icon'>
                <Icon name='group' size={20} />
            </Button>
            <Button type='icon'>
                <Icon name='chats' size={20} />
            </Button>
        </View>
    )
}