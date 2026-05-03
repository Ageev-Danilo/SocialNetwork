import { View, Text } from 'react-native';
import { COLORS } from '@/shared/consts';
import { SettingsForm } from '@/modules/settings';
import { TabMenu } from '@/components/TabMenu';

export default function SettingsScreen() {
    return (
        <View style={{ 
            flex: 1, 
            backgroundColor: '#f7f4ff' 
            }}>
            <TabMenu type='transparent' />
            <SettingsForm />
        </View>
    );
}