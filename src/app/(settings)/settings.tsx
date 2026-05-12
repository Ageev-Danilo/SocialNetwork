import { View, Text } from 'react-native';
import { COLORS } from '@/shared/consts';
import { SettingsForm } from '@/modules/settings';
import { TabMenu } from '@/components/TabMenu';
import { TabItem } from '@/shared/types/component.types';

const TABS: TabItem[] = [
    { label: 'Особиста інформація', href: '/settingsTabs' },
    { label: 'Альбоми', href: '/settingsTabs/albums' },
];

export default function SettingsScreen() {
    return (
        <View style={{
            flex: 1, 
            backgroundColor: '#f7f4ff' 
            }}>
            <TabMenu type='transparent' tabs={TABS} />
            <SettingsForm />
        </View>
    );
}