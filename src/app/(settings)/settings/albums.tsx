import { View, ScrollView } from 'react-native';
import { TabMenu } from '@/components/TabMenu';
import { AlbumsScreen } from '@/modules/albums/ui/AlbumsScreen';

export default function SettingsAlbumsScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '#E9E5EE' }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
                <TabMenu /> 
                <AlbumsScreen />
            </ScrollView>
        </View>
    );
}