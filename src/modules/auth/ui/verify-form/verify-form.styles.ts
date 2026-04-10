import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 24,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#070A1C',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    codeContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    codeInput: {
        width: 44,
        height: 56,
        borderWidth: 1,
        borderColor: '#CDCED2',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600',
        color: '#070A1C',
    },
    codeInputFilled: {
        borderColor: '#543C52',
    },
    error: {
        fontSize: 12,
        color: '#E53935',
    },
    resend: {
        fontSize: 14,
        color: '#543C52',
        textDecorationLine: 'underline',
    },
    footer: {
        alignItems: 'center',
        gap: 12,
    },
});