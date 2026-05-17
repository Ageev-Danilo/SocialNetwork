import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { FriendsTabs } from '@/components/FriendsTabs';
import { FriendCard } from '@/modules/friends';
import {
    MOCK_REQUESTS,
    MOCK_RECOMMENDATIONS,
    MOCK_FRIENDS,
} from '@/modules/friends';
import {
    useSendFriendRequestMutation,
    useAddFriendMutation,
    useRemoveFriendMutation,
} from '@/modules/friends';
import type { FriendCardData } from '@/modules/friends';

interface SectionProps {
    title:     string;
    emptyText: string;
    onSeeAll?: () => void;
    children?: React.ReactNode;
    isEmpty:   boolean;
}

function FriendSection({ title, emptyText, onSeeAll, children, isEmpty }: SectionProps) {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Pressable onPress={onSeeAll}>
                    <Text style={styles.seeAllText}>Дивитись всі</Text>
                </Pressable>
            </View>
            {isEmpty ? (
                <View style={styles.emptyContent}>
                    <Text style={styles.emptyText}>{emptyText}</Text>
                </View>
            ) : (
                <View style={styles.content}>{children}</View>
            )}
        </View>
    );
}

export default function FriendsScreen() {
    const [activeTab, setActiveTab] = useState('main');

    const [sendFriendRequest] = useSendFriendRequestMutation();
    const [addFriend]         = useAddFriendMutation();
    const [removeFriend]      = useRemoveFriendMutation();

    function goToTab(tab: string) {
        setActiveTab(tab);
    }

    function openProfile(userId: number) {
        router.push({
            pathname: '/(friends)/user-profile',
            params:   { userId },
        } as any);
    }

    function handleConfirm(friend: FriendCardData) {
        console.log('[Friends] → переходимо на профіль userId:', friend.id);
        openProfile(friend.id);
    }

    async function handleRemove(friend: FriendCardData) {
        console.log('[Friends] remove pressed, userId:', friend.id);
        try {
            const result = await removeFriend({
                profile: {
                    id:           friend.id,
                    userId:       friend.id,
                    pseudonym:    friend.username,
                    firstName:    friend.name.split(' ')[0] ?? '',
                    lastName:     friend.name.split(' ')[1] ?? '',
                    date:         '',
                    username:     friend.username,
                    signature:    null,
                    profileImage: null,
                },
            }).unwrap();
            console.log('[Friends] removeFriend result:', result);
        } catch (e) {
            console.log('[Friends] removeFriend error (бекенд не готовий):', e);
        }
    }

    const renderRequests = (mode: 'request' | 'recommendation' | 'friend' = 'request') =>
        MOCK_REQUESTS.map(f => (
            <FriendCard
                key={f.id}
                data={f}
                mode={mode}
                onConfirm={() => handleConfirm(f)}
                onRemove={() => handleRemove(f)}
            />
        ));

    const renderRecommendations = () =>
        MOCK_RECOMMENDATIONS.map(f => (
            <FriendCard
                key={f.id}
                data={f}
                mode="recommendation"
                onConfirm={() => handleConfirm(f)}
                onRemove={() => handleRemove(f)}
            />
        ));

    const renderFriends = () =>
        MOCK_FRIENDS.map(f => (
            <FriendCard
                key={f.id}
                data={f}
                mode="friend"
                onConfirm={() => handleConfirm(f)}
                onRemove={() => handleRemove(f)}
            />
        ));

    const renderContent = () => {
        switch (activeTab) {
            case 'requests':
                return (
                    <FriendSection
                        title="Запити"
                        isEmpty={MOCK_REQUESTS.length === 0}
                        emptyText="У вас поки немає нових запитів"
                    >
                        {renderRequests('request')}
                    </FriendSection>
                );
            case 'recommendations':
                return (
                    <FriendSection
                        title="Рекомендації"
                        isEmpty={MOCK_RECOMMENDATIONS.length === 0}
                        emptyText="Рекомендацій поки немає"
                    >
                        {renderRecommendations()}
                    </FriendSection>
                );
            case 'all':
                return (
                    <FriendSection
                        title="Всі друзі"
                        isEmpty={MOCK_FRIENDS.length === 0}
                        emptyText="Список друзів порожній"
                    >
                        {renderFriends()}
                    </FriendSection>
                );
            default:
                return (
                    <>
                        <FriendSection
                            title="Запити"
                            isEmpty={MOCK_REQUESTS.length === 0}
                            emptyText="У вас поки немає нових запитів"
                            onSeeAll={() => goToTab('requests')}
                        >
                            {renderRequests('request')}
                        </FriendSection>
                        <FriendSection
                            title="Рекомендації"
                            isEmpty={MOCK_RECOMMENDATIONS.length === 0}
                            emptyText="Рекомендацій поки немає"
                            onSeeAll={() => goToTab('recommendations')}
                        >
                            {renderRecommendations()}
                        </FriendSection>
                        <FriendSection
                            title="Всі друзі"
                            isEmpty={MOCK_FRIENDS.length === 0}
                            emptyText="Список друзів порожній"
                            onSeeAll={() => goToTab('all')}
                        >
                            {renderFriends()}
                        </FriendSection>
                    </>
                );
        }
    };

    return (
        <View style={styles.screen}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
            >
                <FriendsTabs activeTab={activeTab} onTabChange={setActiveTab} />
                {renderContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: '#F3F4F6',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    cardContainer: {
        backgroundColor:   'white',
        width:             '100%',
        marginTop:         12,
        borderRadius:      16,
        borderTopWidth:    1,
        borderBottomWidth: 1,
        borderColor:       '#EBEBEB',
        paddingVertical:   16,
    },
    sectionHeader: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
        paddingHorizontal: 16,
        marginBottom:   16,
    },
    sectionTitle: {
        fontSize:   18,
        fontWeight: '700',
        color:      '#1A1A1A',
    },
    seeAllText: {
        fontSize:   14,
        color:      '#543C52',
        fontWeight: '700',
    },
    emptyContent: {
        paddingHorizontal: 16,
        paddingVertical:   30,
        backgroundColor:   'white',
        marginHorizontal:  16,
        borderRadius:      8,
        borderWidth:       1,
        borderColor:       '#F0F0F0',
        alignItems:        'center',
    },
    emptyText: {
        color:    '#999',
        fontSize: 14,
    },
    content: {
        paddingHorizontal: 16,
    },
});