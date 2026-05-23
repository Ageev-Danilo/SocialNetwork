import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CHAT_COLORS } from './chat-theme';

export type ChatTabId = 'contacts' | 'messages' | 'groups';

const CHAT_TABS: { label: string; id: ChatTabId }[] = [
    { label: 'Контакти',     id: 'contacts' },
    { label: 'Повідомлення', id: 'messages' },
    { label: 'Групові чати', id: 'groups' },
];

interface Props {
    activeTab:   ChatTabId;
    onTabChange: (id: ChatTabId) => void;
}

export function ChatTabs({ activeTab, onTabChange }: Props) {
    return (
        <View style={styles.container}>
            {CHAT_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <Pressable
                        key={tab.id}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => onTabChange(tab.id)}
                    >
                        <Text style={[styles.text, isActive && styles.textActive]}>
                            {tab.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection:     'row',
        backgroundColor:   CHAT_COLORS.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: CHAT_COLORS.border,
    },
    tab: {
        flex:              1,
        paddingVertical:   14,
        alignItems:        'center',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: CHAT_COLORS.primary,
    },
    text: {
        fontSize:   14,
        color:      CHAT_COLORS.textLight,
        fontWeight: '600',
    },
    textActive: {
        color:      CHAT_COLORS.primary,
        fontWeight: '700',
    },
});
