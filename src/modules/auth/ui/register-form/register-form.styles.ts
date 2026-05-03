import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 24,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#070A1C',
        textAlign: 'center',
    },
    fields: {
        gap: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#070A1C',
        marginBottom: 4,
    },
    error: {
        fontSize: 12,
        color: '#E53935',
        marginTop: 4,
    },
    footer: {
        alignItems: 'center',
    },
});