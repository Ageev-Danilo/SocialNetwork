import { useSegments, useRootNavigation } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { Header, Bottom } from '@/components'; 
import { store } from '@/shared/store';
import { UserContextProvider } from '@/modules/auth';
import { AuthGate } from '@/modules/auth/ui/auth-gate'; 

function AppContent() {
    const segments = useSegments();
    
    const inAuth = segments[0] === '(auth)';

    return (
        <View style={{ flex: 1 }}>
            {!inAuth && <Header />}
            
            <View style={{
                flex: 1, 
                backgroundColor: inAuth ? '#F3F4F6' : '#f7f4ff' 
            }}>
                <AuthGate />
            </View>

            {!inAuth && <Bottom />}
        </View>
    );
}

export default function RootLayout() {
    const rootNavigation = useRootNavigation();

    if (!rootNavigation?.isReady) {
        return null; 
    }

    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <UserContextProvider>
                    <StatusBar style="auto" />
                    <AppContent />
                </UserContextProvider>
            </Provider>
        </SafeAreaProvider>
    );
}