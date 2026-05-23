import { View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon } from '@/shared/ui';
import { router, usePathname } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootState, AppDispatch } from '@/shared/store';
import { closeCreatePost, openCreatePost } from '@/shared/store/modal.slice';
import { CreatePostModal } from './CreatePostModal';
import { CreateGroupButton } from './CreateGroupButton';
import { baseApi } from '@/shared/api/base';
import { useUserContext } from '@/modules/auth/context';

const CREATE_POST_ROUTES = ['/home', '/posts'];
const SETTINGS_ROUTES    = ['/settings', '/settings/albums'];
const CHAT_MAIN_ROUTE    = '/chat';

export function Header() {
    const dispatch  = useDispatch<AppDispatch>();
    const pathname  = usePathname();
    const isOpen    = useSelector((state: RootState) => state.modal.isCreatePostOpen);
    const { setToken, setUser } = useUserContext();

    const showCreatePostButton = CREATE_POST_ROUTES.some(r => pathname === r);
    const showCreateGroupButton = pathname === CHAT_MAIN_ROUTE;
    const isChatSection         = pathname === CHAT_MAIN_ROUTE || pathname.startsWith('/chat/');
    const showSettingsButton    = !isChatSection;
    const isSettingsActive      = SETTINGS_ROUTES.some(r => pathname === r);

    async function handleLogout() {
        await AsyncStorage.removeItem('token');
        setToken(null);
        setUser(null);
        dispatch(baseApi.util.resetApiState());
        router.replace('/(auth)/login');
    }

    return (
        <View style={styles.headerContainer}>
            <SafeAreaView edges={['top']} style={styles.safe}>
                <View style={styles.nav}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={{ width: 145, height: 18 }}
                        resizeMode="contain"
                    />
                    <View style={styles.actions}>
                        {showCreatePostButton && (
                            <Button
                                type="outline"
                                onPress={() => dispatch(openCreatePost())}
                            >
                                <Icon name="add" />
                            </Button>
                        )}

                        {showCreateGroupButton && <CreateGroupButton />}

                        {showSettingsButton && (
                            <Button
                                type="outline"
                                onPress={() => router.push('/settings')}
                                style={isSettingsActive && styles.activeBtn}
                            >
                                <Icon name="settings" />
                            </Button>
                        )}

                        <Button
                            type="outline"
                            onPress={handleLogout}
                        >
                            <Icon name="logout" />
                        </Button>
                    </View>
                </View>
            </SafeAreaView>

            <CreatePostModal
                visible={isOpen}
                onClose={() => dispatch(closeCreatePost())}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor:   'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    safe: {
        backgroundColor: 'white',
    },
    nav: {
        height:            56,
        width:             '100%',
        flexDirection:     'row',
        alignItems:        'center',
        justifyContent:    'space-between',
        paddingHorizontal: 16,
    },
    actions: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           10,
    },
    activeBtn: {
        backgroundColor: '#E9E5EE',
        borderColor:     '#E9E5EE',
    },
});