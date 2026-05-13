import { View } from 'react-native';
import { TabBtn } from '../shared/ui/Button';

import { BASE } from '@/shared/consts';
import { SafeAreaView } from 'react-native-safe-area-context';


export function Bottom() {
    return (
        <SafeAreaView style={[BASE.center, BASE.bottomBar]} edges={['bottom']}>
            <TabBtn icon="home" label="Головна" href="/home" />
            <TabBtn icon="img" label="Мої публікації" href="/posts" />
            <TabBtn icon="group" label="Друзі" href="/friends" />
            <TabBtn icon="chat" label="Чати" href="/chat" />
        </SafeAreaView>
    );
}