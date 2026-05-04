import { View, Image, StyleSheet } from 'react-native';
import { Button, Icon } from '@/shared/ui';
import { BASE } from '@/shared/consts';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Header() {
    return (
        <SafeAreaView edges={['top']}>
            <View style={[BASE.nav, BASE.yc]}>
                <Image source={require('../assets/logo.png')} style={{ width: 145, height: 18 }} />
                <View style={[BASE.yc, { gap: 10 }]}>
                    <Button type="outline" style={styles.navBtn} icon='add' onPress={() => router.push('/(posts)/create-post')} />
                    <Button type="outline" style={styles.navBtn} icon='settings' onPress={() => router.push('/(settings)/settings')} />
                    <Button type="outline" style={styles.navBtn} icon='logout' onPress={() => router.push('/(auth)/logout')} />
                </View>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    navBtn: {
        width: 40,
        height: 40
    }
})