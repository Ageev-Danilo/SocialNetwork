import { View, Text, Image, FlatList, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '@/shared/ui';
import type { ChatMessage } from '../model/mock-data';

interface Props {
    title:       string;
    subtitle?:   string;
    avatarUri:   string;
    messages:    ChatMessage[];
}

export function ChatThreadScreen({ title, subtitle, avatarUri, messages }: Props) {
    return (
        <View style={styles.screen}>
            <View style={styles.topBar}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </Pressable>
                <Image source={{ uri: avatarUri }} style={styles.headerAvatar} />
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
                    {subtitle ? (
                        <Text style={styles.headerSubtitle} numberOfLines={1}>{subtitle}</Text>
                    ) : null}
                </View>
            </View>

            <FlatList
                data={messages}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                renderItem={({ item }) => (
                    <View style={[styles.bubbleWrap, item.isMine && styles.bubbleWrapMine]}>
                        <View style={[styles.bubble, item.isMine ? styles.bubbleMine : styles.bubbleOther]}>
                            <Text style={[styles.bubbleText, item.isMine && styles.bubbleTextMine]}>
                                {item.text}
                            </Text>
                            <Text style={[styles.bubbleTime, item.isMine && styles.bubbleTimeMine]}>
                                {item.time}
                            </Text>
                        </View>
                    </View>
                )}
            />

            <View style={styles.inputBar}>
                <View style={styles.inputPlaceholder}>
                    <Text style={styles.inputPlaceholderText}>Написати повідомлення...</Text>
                </View>
                <Pressable style={styles.sendBtn}>
                    <Icon name="add" size={18} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: '#F3F4F6',
    },
    topBar: {
        flexDirection:     'row',
        alignItems:        'center',
        paddingHorizontal: 12,
        paddingVertical:   12,
        backgroundColor:   '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        gap:               10,
    },
    backBtn: {
        width:          36,
        height:         36,
        justifyContent: 'center',
        alignItems:     'center',
    },
    backText: {
        fontSize:   24,
        color:      '#543C52',
        fontWeight: '600',
    },
    headerAvatar: {
        width:        40,
        height:       40,
        borderRadius: 20,
    },
    headerInfo: { flex: 1 },
    headerTitle: {
        fontSize:   17,
        fontWeight: '700',
        color:      '#1A1A1A',
    },
    headerSubtitle: {
        fontSize: 13,
        color:    '#81818D',
    },
    messagesList: {
        padding:          16,
        paddingBottom:    24,
        gap:              8,
    },
    bubbleWrap: {
        alignItems: 'flex-start',
    },
    bubbleWrapMine: {
        alignItems: 'flex-end',
    },
    bubble: {
        maxWidth:        '80%',
        paddingHorizontal: 14,
        paddingVertical:   10,
        borderRadius:      16,
        gap:               4,
    },
    bubbleOther: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
    bubbleMine: {
        backgroundColor: '#543C52',
        borderBottomRightRadius: 4,
    },
    bubbleText: {
        fontSize: 15,
        color:    '#1A1A1A',
    },
    bubbleTextMine: {
        color: '#fff',
    },
    bubbleTime: {
        fontSize:  11,
        color:     '#999',
        alignSelf: 'flex-end',
    },
    bubbleTimeMine: {
        color: 'rgba(255,255,255,0.7)',
    },
    inputBar: {
        flexDirection:     'row',
        alignItems:        'center',
        paddingHorizontal: 16,
        paddingVertical:   12,
        backgroundColor:   '#fff',
        borderTopWidth:    1,
        borderTopColor:    '#F0F0F0',
        gap:               10,
    },
    inputPlaceholder: {
        flex:              1,
        backgroundColor:   '#F3F4F6',
        borderRadius:      24,
        paddingHorizontal: 16,
        paddingVertical:   12,
    },
    inputPlaceholderText: {
        color:    '#999',
        fontSize: 15,
    },
    sendBtn: {
        width:           44,
        height:          44,
        borderRadius:    22,
        backgroundColor: '#543C52',
        justifyContent:  'center',
        alignItems:      'center',
    },
});
