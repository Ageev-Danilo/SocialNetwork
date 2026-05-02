import { View, Image, StyleSheet } from 'react-native';

export function AuthHeader() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../../../../assets/logo.png')}
                style={{ width: 120, height: 16 }}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width:           '100%',
        backgroundColor: 'white',
        paddingVertical: 16,
        alignItems:      'center',
    },
});