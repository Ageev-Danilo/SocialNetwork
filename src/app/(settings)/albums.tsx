import { View, Text } from 'react-native';
import { TabMenu } from '@/components/TabMenu';
import { TabItem } from '@/shared/types/component.types';

const TABS: TabItem[] = [
    { label: 'Особиста інформація', href: '/settings' },
    { label: 'Альбоми', href: '/settings/albums' },
];

export default function AlbumsScreen() {
    return (
        <View style={{
            flex: 1, 
            backgroundColor: '#f7f4ff' 
            }}>
            <TabMenu type='transparent' tabs={TABS} />
            <Text>Albums</Text>
        </View>
    );
}