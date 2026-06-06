import { View, Text, Pressable, StyleSheet } from 'react-native';
import { CHAT_COLORS } from './chat-theme';
import { ContactsTabIcon, MessagesTabIcon } from './ChatIcons';


export type ChatTabId = 'contacts' | 'messages' | 'groups';

const CHAT_TABS: { label: string; id: ChatTabId }[] = [
    { label: 'Контакти',     id: 'contacts' },
    { label: 'Повідомлення', id: 'messages' },
    { label: 'Групові чати', id: 'groups'   },
];

interface Props {
    activeTab:     ChatTabId;
    onTabChange:   (id: ChatTabId) => void;
    messageBadge?: number;
    groupBadge?:   number;
}

function TabIcon({ id, active }: { id: ChatTabId; active: boolean }) {
    const color = active ? CHAT_COLORS.primary : CHAT_COLORS.textLight;
    if (id === 'contacts') return <ContactsTabIcon color={color} size={20} />;
    return <MessagesTabIcon color={color} size={20} />;
}

export function ChatTabs({ activeTab, onTabChange, messageBadge, groupBadge }: Props) {
    return (
        <View style={styles.container}>
            {CHAT_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const badge =
                    tab.id === 'messages' ? messageBadge :
                    tab.id === 'groups'   ? groupBadge   : undefined;
                const hasBadge = badge != null && badge > 0;

                return (
                    <Pressable
                        key={tab.id}
                        style={[styles.tab, isActive && styles.tabActive]}
                        onPress={() => onTabChange(tab.id)}
                    >
                        <View style={styles.iconWrap}>
                            <TabIcon id={tab.id} active={isActive} />
                            {hasBadge && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{badge}</Text>
                                </View>
                            )}
                        </View>
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
        flexDirection:   'row',
        backgroundColor: CHAT_COLORS.cardBg,
    },
    tab: {
        flex:           1,
        paddingVertical: 10,
        alignItems:     'center',
        gap:            4,
        borderTopWidth: 2,
        borderTopColor: 'transparent',
    },
    tabActive:  { borderTopColor: CHAT_COLORS.primary },
    iconWrap:   { position: 'relative' },
    badge: {
        position:          'absolute',
        top:               -4,
        right:             -8,
        minWidth:          16,
        height:            16,
        borderRadius:      8,
        backgroundColor:   CHAT_COLORS.badge,
        justifyContent:    'center',
        alignItems:        'center',
        paddingHorizontal: 4,
    },
    badgeText:  { color: '#fff', fontSize: 10, fontWeight: '700' },
    text:       { fontSize: 12, color: CHAT_COLORS.textLight, fontWeight: '600' },
    textActive: { color: CHAT_COLORS.primary, fontWeight: '700' },
});