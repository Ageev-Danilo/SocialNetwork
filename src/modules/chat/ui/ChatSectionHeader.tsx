import type { ReactNode } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CHAT_COLORS } from './chat-theme';

interface Props {
    title:       string;
    rightIcon?:  ReactNode;
    badge?:      number;
    onRightPress?: () => void;
}

export function ChatSectionHeader({ title, rightIcon, badge, onRightPress }: Props) {
    return (
        <View style={styles.row}>
            <Text style={styles.title}>{title}</Text>
            {(rightIcon || badge != null) && (
                <Pressable
                    style={styles.right}
                    onPress={onRightPress}
                    disabled={!onRightPress}
                >
                    {rightIcon}
                    {badge != null && badge > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                    )}
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection:     'row',
        alignItems:        'center',
        justifyContent:    'space-between',
        paddingHorizontal: 16,
        paddingTop:        16,
        paddingBottom:     12,
    },
    title: {
        fontSize:   20,
        fontWeight: '700',
        color:      CHAT_COLORS.text,
    },
    right: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           6,
    },
    badge: {
        minWidth:          20,
        height:            20,
        borderRadius:      10,
        backgroundColor:   CHAT_COLORS.badge,
        justifyContent:    'center',
        alignItems:        'center',
        paddingHorizontal: 5,
    },
    badgeText: {
        color:      '#fff',
        fontSize:   12,
        fontWeight: '700',
    },
});
