import { View } from 'react-native';
import { Slot } from 'expo-router';
import { TabMenu } from '@/components';

export default function HomeLayout() {
    return (
        <View style={{ flex: 1 }}>
            <TabMenu />
            <Slot />
        </View>
    );
}