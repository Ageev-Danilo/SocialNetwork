import { View, Image } from 'react-native';
import { Button, Icon } from '@/shared/ui';
import { BASE } from '@/shared/consts';
import { router } from 'expo-router';

export function Header() {
    const handleLogout = () => {
        router.push('/(auth)/login');
    };

    return (
        <View style={[BASE.nav, BASE.yc]}>
            <Image
                source={require('../assets/logo.png')}
                style={{ width: 145, height: 18 }}
            />
            <View style={[BASE.yc, { gap: 10 }]}>
                <Button type="outline"><Icon name="add" /></Button>
                <Button type="outline"><Icon name="settings" /></Button>
                <Button type="outline" onPress={handleLogout}><Icon name="logout" /></Button>
            </View>
        </View>
    );
}