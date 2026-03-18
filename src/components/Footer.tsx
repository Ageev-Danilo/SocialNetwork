import { View } from 'react-native';
import { TabBtn } from '@/shared/ui';

export function Footer() {
    return (
        <View style={{
            flexDirection: 'row',
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#EBEBEB',
        }}>
            <TabBtn icon="home"  label="Головна"        href="/home"    />
            <TabBtn icon="img"   label="Мої публікації" href="/posts"   />
            <TabBtn icon="group" label="Друзі"          href="/friends" />
            <TabBtn icon="chat"  label="Чати"           href="/chat"    />
        </View>
    );
}