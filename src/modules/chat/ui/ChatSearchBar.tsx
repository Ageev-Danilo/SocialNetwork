import { View, TextInput, StyleSheet } from 'react-native';
import { SearchIcon } from './ChatIcons';
import { CHAT_COLORS } from './chat-theme';

interface Props {
    value:         string;
    onChangeText:  (text: string) => void;
    placeholder?:  string;
}

export function ChatSearchBar({ value, onChangeText, placeholder = 'Пошук' }: Props) {
    return (
        <View style={styles.wrap}>
            <SearchIcon />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={CHAT_COLORS.textLight}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection:     'row',
        alignItems:        'center',
        marginHorizontal:  16,
        marginBottom:      12,
        paddingHorizontal: 14,
        paddingVertical:   10,
        borderRadius:      24,
        borderWidth:       1,
        borderColor:       CHAT_COLORS.border,
        backgroundColor:   CHAT_COLORS.cardBg,
        gap:               10,
    },
    input: {
        flex:     1,
        fontSize: 15,
        color:    CHAT_COLORS.text,
        padding:  0,
    },
});
