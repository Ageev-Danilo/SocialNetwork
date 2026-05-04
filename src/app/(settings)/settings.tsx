import { View, Text } from 'react-native';
import { COLORS } from '@/shared/consts';
import { SettingsForm } from '@/modules/settings';

export default function SettingsScreen() {
    return (
        <View style={{ 
            flex: 1, 
            backgroundColor: '#f7f4ff' 
            }}>
            <View style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: '#EBEBEB',
            }}>
            </View>
            <SettingsForm />
        </View>
    );
}