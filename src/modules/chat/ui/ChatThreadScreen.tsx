import { View, Text, Image, FlatList, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Button, Icon, Input } from '@/shared/ui';
import type { ThreadItem, MessageStatus } from '../model/mock-data';
import { CHAT_COLORS } from './chat-theme';
import {
    BackIcon, SendIcon, MenuDotsIcon,
    CheckSingleIcon, CheckDoubleIcon,
} from './ChatIcons';

interface Props {
    title:       string;
    subtitle?:   string;
    avatarUri?:  string;
    initials?:   string;
    items:       ThreadItem[];
}

function MessageStatusIcon({ status }: { status?: MessageStatus }) {
    if (status === 'read' || status === 'delivered') {
        return <CheckDoubleIcon />;
    }
    return <CheckSingleIcon />;
}

export function ChatThreadScreen({ title, subtitle, avatarUri, initials, items }: Props) {
    const avatarLabel = initials ?? title.slice(0, 2).toUpperCase();

    function renderItem({ item }: { item: ThreadItem }) {
        if (item.type === 'date') {
            return (
                <View style={styles.dateWrap}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateText}>{item.label}</Text>
                    </View>
                </View>
            );
        }

        if (item.type === 'divider') {
            return (
                <View style={styles.dividerWrap}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>{item.label}</Text>
                    <View style={styles.dividerLine} />
                </View>
            );
        }

        const msg = item.data;

        if (msg.isMine) {
            return (
                <View style={styles.mineWrap}>
                    <View style={styles.bubbleMine}>
                        <Text style={styles.bubbleText}>{msg.text}</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaTime}>{msg.time}</Text>
                            <MessageStatusIcon status={msg.status} />
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View style={styles.otherWrap}>
                {msg.senderAvatarUri ? (
                    <Image source={{ uri: msg.senderAvatarUri }} style={styles.msgAvatar} />
                ) : (
                    <View style={[styles.msgAvatar, styles.msgAvatarPlaceholder]} />
                )}
                <View style={styles.bubbleOther}>
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.metaTime}>{msg.time}</Text>
                        <MessageStatusIcon status={msg.status} />
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <Pressable onPress={() => router.back()} style={styles.iconBtn}>
                    <BackIcon />
                </Pressable>

                {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />
                ) : (
                    <View style={[styles.headerAvatar, styles.headerAvatarInitials]}>
                        <Text style={styles.headerInitialsText}>{avatarLabel}</Text>
                    </View>
                )}

                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
                    {subtitle ? (
                        <Text style={styles.headerSubtitle} numberOfLines={1}>{subtitle}</Text>
                    ) : null}
                </View>

                <Pressable style={styles.iconBtn}>
                    <MenuDotsIcon />
                </Pressable>
            </View>

            <FlatList
                data={items}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                renderItem={renderItem}
            />

            <View style={styles.inputBar}>
                <Input type='text' placeholder="Повідомлення" style={{ flex: 1 }} />
                <Button type='outline' icon='img' style={styles.attachBtn} />
                <Button type='fill' icon='send' style={styles.sendBtn} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: CHAT_COLORS.screenBg,
    },
    topBar: {
        flexDirection:     'row',
        alignItems:        'center',
        paddingHorizontal: 8,
        paddingVertical:   10,
        backgroundColor:   CHAT_COLORS.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: CHAT_COLORS.border,
        gap:               8,
    },
    iconBtn: {
        width:          40,
        height:         40,
        justifyContent: 'center',
        alignItems:     'center',
    },
    headerAvatar: {
        width:        44,
        height:       44,
        borderRadius: 22,
    },
    headerAvatarInitials: {
        backgroundColor: CHAT_COLORS.highlight,
        justifyContent:  'center',
        alignItems:      'center',
    },
    headerInitialsText: {
        fontSize:   14,
        fontWeight: '700',
        color:      CHAT_COLORS.primary,
    },
    headerInfo: { flex: 1 },
    headerTitle: {
        fontSize:   17,
        fontWeight: '700',
        color:      CHAT_COLORS.text,
    },
    headerSubtitle: {
        fontSize: 13,
        color:    CHAT_COLORS.textMuted,
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingVertical:   16,
        gap:               12,
    },
    dateWrap: {
        alignItems: 'center',
        marginVertical: 8,
    },
    dateBox: {
        paddingHorizontal: 14,
        paddingVertical:   6,
        borderRadius:      12,
        backgroundColor:   CHAT_COLORS.dateBg,
    },
    dateText: {
        fontSize: 13,
        color:    CHAT_COLORS.textMuted,
    },
    dividerWrap: {
        flexDirection:  'row',
        alignItems:     'center',
        gap:            10,
        marginVertical: 12,
    },
    dividerLine: {
        flex:            1,
        height:          1,
        backgroundColor: CHAT_COLORS.border,
    },
    dividerText: {
        fontSize: 13,
        color:    CHAT_COLORS.textMuted,
    },
    mineWrap: {
        alignItems: 'flex-end',
    },
    bubbleMine: {
        maxWidth:          '78%',
        backgroundColor:   CHAT_COLORS.bubbleMine,
        borderRadius:      16,
        borderBottomRightRadius: 4,
        paddingHorizontal: 14,
        paddingVertical:   10,
        gap:               4,
    },
    otherWrap: {
        flexDirection: 'row',
        alignItems:    'flex-end',
        gap:           8,
        maxWidth:      '88%',
    },
    msgAvatar: {
        width:        36,
        height:       36,
        borderRadius: 18,
    },
    msgAvatarPlaceholder: {
        backgroundColor: CHAT_COLORS.highlight,
    },
    bubbleOther: {
        flex:              1,
        backgroundColor:   CHAT_COLORS.bubbleOther,
        borderWidth:       1,
        borderColor:       CHAT_COLORS.bubbleOtherBorder,
        borderRadius:      16,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 14,
        paddingVertical:   10,
        gap:               4,
    },
    bubbleText: {
        fontSize: 15,
        color:    CHAT_COLORS.text,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems:    'center',
        justifyContent:'flex-end',
        gap:           4,
    },
    metaTime: {
        fontSize: 11,
        color:    CHAT_COLORS.textMuted,
    },
    inputBar: {
        flexDirection:     'row',
        alignItems:        'center',
        paddingHorizontal: 12,
        paddingVertical:   10,
        backgroundColor:   CHAT_COLORS.cardBg,
        borderTopWidth:    1,
        borderTopColor:    CHAT_COLORS.border,
        gap:               8,
    },
    inputField: {
        flex:              1,
        borderWidth:       1,
        borderColor:       CHAT_COLORS.border,
        borderRadius:      10,
        paddingHorizontal: 16,
        paddingVertical:   12,
        backgroundColor:   CHAT_COLORS.cardBg,
    },
    inputPlaceholder: {
        fontSize: 15,
        color:    CHAT_COLORS.textLight,
    },
    attachBtn: {
        width:          44,
        height:         44,
        justifyContent: 'center',
        alignItems:     'center',
    },
    sendBtn: {
        width:           44,
        height:          44,
        borderRadius:    22,
        backgroundColor: CHAT_COLORS.primary,
        justifyContent:  'center',
        alignItems:      'center',
    },
});
