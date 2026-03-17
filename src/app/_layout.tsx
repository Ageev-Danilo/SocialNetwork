import { Slot } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Nav, BottomBar } from '@shared/ui';
import { View } from 'react-native';


export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Nav />
                <View style={{ flex: 1, backgroundColor: '#f7f4ff' }}>
                    <Slot />
                </View>
                <BottomBar />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}