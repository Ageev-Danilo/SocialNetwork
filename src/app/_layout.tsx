import { Slot } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Nav, Bottom } from '@/components';
import { View } from 'react-native';
import { Header, Footer } from '@/components';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <Header />
                <View style={{ flex: 1, backgroundColor: '#f7f4ff' }}>
                    <Slot />
                </View>
                <Bottom />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}