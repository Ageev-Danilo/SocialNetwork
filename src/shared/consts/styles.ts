import { StyleSheet } from 'react-native';

export const BASE = StyleSheet.create({
    center: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    xc: {
        display: 'flex',
        justifyContent: 'center',
    },
    yc: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },

    nav: {
        justifyContent: 'space-between',
        backgroundColor: 'white',
        width: '100%',
        height: 56,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    bottomBar: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    tab: {
        padding: 8,
        paddingBottom: 4,
        gap: 6,
    },
    tabActive: {
        borderTopWidth: 2,
        borderTopColor: '#543C52',
    },
    tabText: {
        fontFamily: 'Arial',
        color: '#070A1C',
        fontWeight: 500,
    },

    btn: {
        height: 46,
        overflow: 'hidden',
        borderRadius: 60,
    },
    btnText: {
        fontSize: 16,
    },
    fill: {
        backgroundColor: '#543C52',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    fillText: {
        color: 'white',
    },
    icon: {
        padding: 10,
    },
    iconText: {
        color: '#543C52',
    },
    outline: {
        borderWidth: 1,
        borderColor: '#543C52',
        padding: 10,
    },
    outlineText: {
        color: '#543C52',
    },
    borderless: {
        minWidth: 68,
        height: 60,
        borderRadius: 0,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: 42,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 42,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#CDCED2',
        borderRadius: 10,
    },
    inputLabel: {
        fontSize: 16,
        color: '#81818D',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 10,
    },
    inputBtn: {
        position: 'absolute',
        right: 8,
        width: 36,
        height: 36
    }
});
