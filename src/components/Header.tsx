import { View, Image, Modal, TouchableOpacity ,StyleSheet} from 'react-native';
import { Button, Icon } from '@/shared/ui';
import { BASE } from '@/shared/consts';
import { router, usePathname } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/shared/store';
import { openCreatePost, closeCreatePost } from '@/shared/store/modal.slice';
import { CreatePostModal } from './CreatePostModal';

const CREATE_POST_ROUTES  = ['/home', '/posts'];
const SETTINGS_ROUTES     = ['/settings', '/settings/albums'];

export function Header() {
    const dispatch  = useDispatch();
    const pathname  = usePathname();
    const isOpen    = useSelector((state: RootState) => state.modal.isCreatePostOpen);

    const showAddButton = CREATE_POST_ROUTES.some((r) => pathname.endsWith(r));

    return (
        <>
            <View style={[BASE.nav, BASE.yc]}>
                <Image
                    source={require('../assets/logo.png')}
                    style={{ width: 145, height: 18 }}
                />

                <View style={[BASE.yc, { gap: 10 }]}>
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

            <CreatePostModal
                visible={isOpen}
                onClose={() => dispatch(closeCreatePost())}
            />
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    safe: {
        backgroundColor: 'white',
    },
    nav: {
        height: 56, 
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    activeBtn: {
        backgroundColor: '#E9E5EE',  
        borderColor: '#E9E5EE',
    },
});
