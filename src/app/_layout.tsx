import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Nav, BottomBar } from '@shared/ui';


export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f4ff' }}>
                <Stack screenOptions={{ headerShown: true, header: props => <Nav route={props.route} /> }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                </Stack>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}