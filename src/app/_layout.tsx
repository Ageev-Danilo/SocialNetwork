import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Nav } from '@shared/ui';
import { Provider } from 'react-redux';
import { store } from '../shared/store'; 

export default function RootLayout() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    <Stack screenOptions={{ header: props => ( <Nav route={props.route} /> ) }}>
                        <Stack.Screen name="(friends)/index" />
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(auth)" />
                    </Stack>
                </SafeAreaView>
            </SafeAreaProvider>
        </Provider>
    );
}