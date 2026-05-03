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
    codeBox: {
        width:           44,
        height:          52,
        borderWidth:     1,
        borderColor:     '#CDCED2', 
        borderRadius:    12,
        backgroundColor: 'white',
        justifyContent:  'center',
        alignItems:      'center',
        position:        'relative',
    },
    codeBoxFilled: {
        borderColor:     '#070A1C', 
    },
    underscore: {
        position:   'absolute',
        bottom:     10,
        fontSize:   22,
        color:      '#CDCED2', 
        fontWeight: '400',
    },
    underscoreActive: {
        color:      '#070A1C', 
        fontWeight: '700',
    },
    codeInput: {
        width:      '100%',
        height:     '100%',
        textAlign:  'center',
        fontSize:   22,
        fontWeight: '700',
        color:      '#070A1C',
        backgroundColor: 'transparent',
    },
    error: {
        fontSize: 12,
        color:    '#E53935',
    },
    resend: {
        fontSize:           16,
        fontWeight:         '600',
        color:              '#070A1C',
    },
    footer: {
        width:      '100%',
        alignItems: 'center',
        gap:        20,
        marginTop:  'auto',
    },
});