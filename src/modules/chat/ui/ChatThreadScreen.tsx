import { View, Text, Image, FlatList, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import type { ThreadItem, MessageStatus } from '../model/mock-data';
import { CHAT_COLORS } from './chat-theme';
import {
    BackIcon, MenuDotsIcon,
    CheckSingleIcon, CheckDoubleIcon,
} from './ChatIcons';
import Svg, { Rect, Path, Circle } from 'react-native-svg';


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

function AttachIcon() {
    return (
        <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <Rect x={0.5} y={0.5} width={39} height={39} rx={19.5} stroke="#543C52" />
            <Path
                d="M11.668 14.9998C11.668 14.1158 12.0192 13.2679 12.6443 12.6428C13.2694 12.0177 14.1172 11.6665 15.0013 11.6665H25.0013C25.8854 11.6665 26.7332 12.0177 27.3583 12.6428C27.9834 13.2679 28.3346 14.1158 28.3346 14.9998V24.9998C28.3346 25.8839 27.9834 26.7317 27.3583 27.3569C26.7332 27.982 25.8854 28.3332 25.0013 28.3332H15.0013C14.1172 28.3332 13.2694 27.982 12.6443 27.3569C12.0192 26.7317 11.668 25.8839 11.668 24.9998V14.9998Z"
                stroke="#543C52"
                strokeWidth={1.66667}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M17.0833 19.1667C18.2339 19.1667 19.1667 18.2339 19.1667 17.0833C19.1667 15.9327 18.2339 15 17.0833 15C15.9327 15 15 15.9327 15 17.0833C15 18.2339 15.9327 19.1667 17.0833 19.1667Z"
                stroke="#543C52"
                strokeWidth={1.66667}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M22.105 20.5171L15 28.3329H25.1108C25.9655 28.3329 26.7851 27.9934 27.3895 27.3891C27.9938 26.7847 28.3333 25.9651 28.3333 25.1104V24.9996C28.3333 24.6113 28.1875 24.4621 27.925 24.1746L24.5667 20.5121C24.4101 20.3414 24.2198 20.2051 24.0076 20.1121C23.7955 20.019 23.5664 19.9712 23.3347 19.9717C23.1031 19.9722 22.8741 20.0209 22.6624 20.1148C22.4507 20.2087 22.2608 20.3457 22.105 20.5171Z"
                stroke="#543C52"
                strokeWidth={1.66667}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

function SendButton() {
    return (
        <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
            <Rect x={0.5} y={0.5} width={39} height={39} rx={19.5} fill="#543C52" stroke="#543C52" />
            <Path
                d="M27.3316 18.63L14.2019 11.1378C13.9251 10.9827 13.6076 10.9156 13.2917 10.9454C12.9758 10.9751 12.6764 11.1004 12.4335 11.3044C12.1905 11.5085 12.0154 11.7817 11.9314 12.0877C11.8475 12.3937 11.8587 12.718 11.9636 13.0175L14.3214 19.9987L11.9636 26.98C11.8807 27.2155 11.8555 27.4674 11.89 27.7147C11.9245 27.962 12.0178 28.1974 12.162 28.4012C12.3062 28.6051 12.4972 28.7713 12.7189 28.8862C12.9406 29.001 13.1866 29.061 13.4363 29.0612C13.7048 29.0607 13.9687 28.9913 14.2027 28.8597L14.2097 28.855L27.3347 21.3495C27.5754 21.2133 27.7756 21.0156 27.9148 20.7767C28.0541 20.5378 28.1275 20.2663 28.1275 19.9897C28.1275 19.7132 28.0541 19.4416 27.9148 19.2027C27.7756 18.9638 27.5754 18.7662 27.3347 18.63H27.3316ZM13.998 26.8159L15.9839 20.9362H20.3113C20.5599 20.9362 20.7984 20.8374 20.9742 20.6616C21.15 20.4858 21.2488 20.2474 21.2488 19.9987C21.2488 19.7501 21.15 19.5116 20.9742 19.3358C20.7984 19.16 20.5599 19.0612 20.3113 19.0612H15.9839L13.9972 13.18L25.9316 19.9901L13.998 26.8159Z"
                fill="white"
            />
        </Svg>
    );
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
                <View style={styles.bubbleOtherCol}>
                    {msg.senderName ? (
                        <Text style={styles.senderName}>{msg.senderName}</Text>
                    ) : null}
                    <View style={styles.bubbleOther}>
                        <Text style={styles.bubbleText}>{msg.text}</Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.metaTime}>{msg.time}</Text>
                            <MessageStatusIcon status={msg.status} />
                        </View>
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
                <View style={styles.inputField}>
                    <Text style={styles.inputPlaceholder}>Повідомлення</Text>
                </View>
                <Pressable style={styles.attachBtn}>
                    <AttachIcon />
                </Pressable>
                <Pressable style={styles.sendBtn}>
                    <SendButton />
                </Pressable>
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
        alignItems:     'center',
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
        maxWidth:                '78%',
        backgroundColor:         CHAT_COLORS.bubbleMine,
        borderRadius:            16,
        borderBottomRightRadius: 4,
        paddingHorizontal:       14,
        paddingVertical:         10,
        gap:                     4,
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
    bubbleOtherCol: {
        flex: 1,
        gap:  2,
    },
    senderName: {
        fontSize:   10,
        fontWeight: '400',
        color:      CHAT_COLORS.primary,
    },
    bubbleOther: {
        backgroundColor:      CHAT_COLORS.bubbleOther,
        borderWidth:          1,
        borderColor:          CHAT_COLORS.bubbleOtherBorder,
        borderRadius:         16,
        borderBottomLeftRadius: 4,
        paddingHorizontal:    14,
        paddingVertical:      10,
        gap:                  4,
    },
    bubbleText: {
        fontSize: 15,
        color:    CHAT_COLORS.text,
    },
    metaRow: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'flex-end',
        gap:            4,
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
        borderRadius:      24,
        paddingHorizontal: 16,
        paddingVertical:   12,
        backgroundColor:   CHAT_COLORS.cardBg,
    },
    inputPlaceholder: {
        fontSize: 15,
        color:    CHAT_COLORS.textLight,
    },
    attachBtn: {
        justifyContent: 'center',
        alignItems:     'center',
    },
    sendBtn: {
        width:          40,
        height:         40,
        justifyContent: 'center',
        alignItems:     'center',
    },
});