import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
    },
    tab: {
        paddingVertical: 12,
        marginRight: 16,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#543C52',
    },
    text: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    textActive: {
        color: '#543C52',
        fontWeight: '700',
    },
});