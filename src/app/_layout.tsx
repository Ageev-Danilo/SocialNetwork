import { Slot } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

import { Header, Footer, Bottom } from '@/components'; 

import { store } from '@/shared/store';
import { UserContextProvider } from '@/modules/auth';

import { AuthGate } from '@/modules/auth/ui/auth-gate'; 

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <UserContextProvider>
                    <StatusBar style="auto" />
                    
                    <SafeAreaView style={{ flex: 1 }}>
                        <Header />
                        
                        <View style={{ flex: 1, backgroundColor: '#f7f4ff' }}>
                            <AuthGate />
                        </View>

                        <Bottom />
                    </SafeAreaView>

                </UserContextProvider>
            </Provider>
        </SafeAreaProvider>
    );
}