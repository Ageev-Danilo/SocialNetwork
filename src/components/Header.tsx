import { View, Image } from 'react-native';
import { Button, Icon } from '@/shared/ui';
import { BASE } from '@/shared/consts';
import { router } from 'expo-router';

export function Header() {
    return (
        <View style={[BASE.nav, BASE.yc]}>
            <Image
                source={require('../assets/logo.png')}
                style={{ width: 145, height: 18 }}
            />
            <View style={[BASE.yc, { gap: 10 }]}>
                <Button 
                    type="outline" 
                    onPress={() => router.push('/(posts)/create-post')}
                >
                    <Icon name="add" />
                </Button>

                <Button
                    type="outline"
                    onPress={() => router.push('/(settings)/settings')}
                >
                    <Icon name="settings" />
                </Button>
                
                <Button
                    type="outline"
                    onPress={() => router.push('/(auth)/logout')}
                >
                    <Icon name="logout" />
                </Button>
            </View>
        </View>
    );
}