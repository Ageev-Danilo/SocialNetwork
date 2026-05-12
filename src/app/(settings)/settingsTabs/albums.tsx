import { View } from 'react-native';
import { TabMenu } from '@/components/TabMenu';
import { AlbumsScreen } from '@/modules/albums/ui/AlbumsScreen';

export default function SettingsAlbumsScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '#f7f4ff' }}>
            <TabMenu />
            <AlbumsScreen />
        </View>
    );
}