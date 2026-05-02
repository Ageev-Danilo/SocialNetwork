import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex:       1,
        gap:        16,
        alignItems: 'center',
    },
    title: {
        fontSize:   20,
        fontWeight: '600',
        color:      '#070A1C',
        textAlign:  'center',
    },
    subtitle: {
        fontSize:   13,
        color:      '#070A1C',
        textAlign:  'center',
        lineHeight: 20,
    },
    codeLabel: {
        fontSize:   14,
        fontWeight: '500',
        color:      '#070A1C',
        alignSelf:  'flex-start',
    },
    codeContainer: {
        flexDirection: 'row',
        gap:           8,
    },
    codeInput: {
        width:           44,
        height:          52,
        borderWidth:     1,
        borderColor:     '#CDCED2',
        borderRadius:    8,
        textAlign:       'center',
        fontSize:        22,
        fontWeight:      '600',
        color:           '#070A1C',
        backgroundColor: 'transparent',
        borderBottomWidth: 3,
        borderBottomColor: '#CDCED2',
    },
    codeInputFilled: {
        borderBottomColor: '#543C52',
    },
    error: {
        fontSize: 12,
        color:    '#E53935',
    },
    resend: {
        fontSize:           14,
        color:              '#543C52',
        textDecorationLine: 'underline',
    },
    footer: {
        width:      '100%',
        alignItems: 'center',
        gap:        12,
        marginTop:  'auto',
    },
});