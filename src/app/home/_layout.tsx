import { View } from 'react-native';
import { Slot } from 'expo-router';

export default function HomeLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Slot />
        </View>
    );
}