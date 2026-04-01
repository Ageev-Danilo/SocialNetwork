import { View } from 'react-native';
import { TabBtn } from '../shared/ui/Button';

import { BASE } from '@/shared/consts';


export function Bottom() {
    return (
        <View style={[BASE.center, BASE.bottomBar]}>
            <TabBtn icon="home" label="Головна" href="/home" />
            <TabBtn icon="img" label="Мої публікації" href="/posts" />
            <TabBtn icon="group" label="Друзі" href="/friends" />
            <TabBtn icon="chat" label="Чати" href="/chat" />
        </View>
    );
}