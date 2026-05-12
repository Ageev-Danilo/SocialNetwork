import { View } from 'react-native';
import { SettingsForm } from '@/modules/settings';
import { TabMenu } from '@/components/TabMenu';

export default function SettingsScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '#f7f4ff' }}>
            <TabMenu />
            <SettingsForm />
        </View>
    );
}