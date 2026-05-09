import { View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon } from '@/shared/ui';
import { router, usePathname } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/shared/store';
import { openCreatePost, closeCreatePost } from '@/shared/store/modal.slice';
import { CreatePostModal } from './CreatePostModal';

const CREATE_POST_ROUTES  = ['/home', '/posts'];
const SETTINGS_ROUTES     = ['/settings', '/settings/albums'];

export function Header() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const isOpen   = useSelector((state: RootState) => state.modal.isCreatePostOpen);

    const showAddButton    = CREATE_POST_ROUTES.some((r) => pathname === r);
    const isSettingsActive = SETTINGS_ROUTES.some((r) => pathname === r);

    return (
        <>
            <SafeAreaView edges={['top']} style={styles.safe}>
                <View style={styles.nav}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={{ width: 145, height: 18 }}
                    />
                    <View style={styles.actions}>
                        {showAddButton && (
                            <Button
                                type="outline"
                                onPress={() => dispatch(openCreatePost())}
                            >
                                <Icon name="add" />
                            </Button>
                        )}

                        <Button
                            type="outline"
                            onPress={() => router.push('/(settings)/settings')}
                            style={isSettingsActive && styles.activeBtn}
                        >
                            <Icon name="settings" />
                        </Button>

                        <Button
                            type="outline"
                            onPress={() => router.push('/(auth)/logout')}
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
        </>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor:   'white',
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