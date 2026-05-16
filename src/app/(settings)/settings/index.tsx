import { View, ScrollView } from 'react-native';
import { SettingsForm } from '@/modules/settings';
import { TabMenu } from '@/components/TabMenu';

export default function SettingsScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '#E9E5EE' }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
                <TabMenu />
                <SettingsForm />
            </ScrollView>
        </View>
    );
}