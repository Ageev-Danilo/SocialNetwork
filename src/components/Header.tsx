import { View, Image, StyleSheet } from 'react-native';
import { Button, Icon } from '@/shared/ui';
import { BASE } from '@/shared/consts';
import { router, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootState } from '@/shared/store';
import { openCreatePost, closeCreatePost } from '@/shared/store/modal.slice';
import { CreatePostModal } from './CreatePostModal';
import { useDispatch, useSelector } from 'react-redux';

export function Header() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const isOpen = useSelector((state: RootState) => state.modal.isCreatePostOpen);

    const showAddButton = ['/', '/home', '/posts'].some(r => pathname.endsWith(r));

    return (
        <SafeAreaView edges={['top']}>
            <View style={[BASE.nav, BASE.yc]}>
                <Image source={require('../assets/logo.png')} style={{ width: 145, height: 18 }} />
                <View style={[BASE.yc, { gap: 10 }]}>
                    {showAddButton && (
                        <Button
                            type="outline"
                            style={styles.navBtn}
                            icon="add"
                            onPress={() => dispatch(openCreatePost())}
                        />
                    )}
                    <Button
                        type="outline"
                        style={styles.navBtn}
                        icon="settings"
                        onPress={() => router.push('/(settings)/settings')}
                    />
                    <Button
                        type="outline"
                        style={styles.navBtn}
                        icon="logout"
                        onPress={() => router.push('/(auth)/logout')}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    navBtn: {
        width: 40,
        height: 40,
    },
});
