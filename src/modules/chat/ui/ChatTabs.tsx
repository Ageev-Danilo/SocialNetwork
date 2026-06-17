import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CHAT_COLORS } from './chat-theme';
import { Button, Icon } from '@/shared/ui';

export type ChatTabId = 'contacts' | 'messages' | 'groups';

const CHAT_TABS: { label: string; id: ChatTabId }[] = [
    { label: 'Контакти', id: 'contacts' },
    { label: 'Повідомлення', id: 'messages' },
    { label: 'Групові чати', id: 'groups' },
];

interface Props {
    activeTab: ChatTabId;
    onTabChange: (id: ChatTabId) => void;
    messageBadge?: number;
    groupBadge?: number;
}

export function ChatTabs({ activeTab, onTabChange, messageBadge, groupBadge }: Props) {
    return (
        <View style={styles.container}>
            {CHAT_TABS.map(tab => {
                const isActive = activeTab === tab.id;
                const SelectedIcon =
                    tab.id === 'contacts'
                        ? Icon.group
                        : tab.id === 'messages'
                          ? Icon.chat
                          : Icon.chat;

                return (
                    <Button
                        type="borderless"
                        key={tab.id}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => onTabChange(tab.id)}
                    >
                        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <SelectedIcon />
                            <Text style={[styles.text, isActive && styles.textActive]}>
                                {tab.label}
                            </Text>
                        </View>
                    </Button>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: CHAT_COLORS.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: CHAT_COLORS.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: CHAT_COLORS.primary,
    },
    iconWrap: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -8,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: CHAT_COLORS.badge,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    text: {
        fontSize: 14,
        color: CHAT_COLORS.textLight,
        fontWeight: '600',
    },
    textActive: {
        color: CHAT_COLORS.primary,
        fontWeight: '700',
    },
});
