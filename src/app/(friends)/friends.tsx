import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { FriendsTabs } from '@/components/FriendsTabs';
import { FriendCard } from '@/modules/friends';
import {
    useGetRecommendationsQuery,
    useGetFriendRequestsQuery,
    useGetFriendsQuery,
    useSendFriendRequestMutation,
    useRejectFriendRequestMutation,
    useRemoveFriendMutation,
} from '@/modules/friends';
import type { FriendCardData } from '@/modules/friends';

const BASE_IP = '10.0.2.2';
const API_MEDIA_BASE = process.env.EXPO_PUBLIC_API_URL ?? `http://${BASE_IP}:3000`;

function buildAvatarUri(profileImage: string | null | undefined): string {
    if (!profileImage) return 'https://g-issues.com/wp-content/uploads/2019/08/default-avatar.png';
    if (profileImage.startsWith('http') || profileImage.startsWith('file')) return profileImage;
    if (profileImage.startsWith('/media')) return `${API_MEDIA_BASE}${profileImage}`;
    return `${API_MEDIA_BASE}/media/thumbnail/${profileImage}`;
}

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
                {onSeeAll && (
                    <Pressable onPress={onSeeAll}>
                        <Text style={styles.seeAllText}>Дивитись всі</Text>
                    </Pressable>
                )}
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

    const { data: recommendationsData = [], isLoading: isRecLoading }     = useGetRecommendationsQuery();
    const { data: requestsData        = [], isLoading: isReqLoading }     = useGetFriendRequestsQuery();
    const { data: friendsData         = [], isLoading: isFriendsLoading } = useGetFriendsQuery();

    const [sendFriendRequest]   = useSendFriendRequestMutation();
    const [rejectFriendRequest] = useRejectFriendRequestMutation();
    const [removeFriend]        = useRemoveFriendMutation();

    const mappedRequests: FriendCardData[] = requestsData.map(req => ({
        id:       req.sender.id,
        name:     req.sender.pseudonym || 'Видалений',
        username: req.sender.username  || 'user',
        avatar:   { uri: buildAvatarUri(req.sender.profileImage) },
    }));

    const mappedRecommendations: FriendCardData[] = recommendationsData.map(rec => ({
        id:       rec.id,
        name:     rec.pseudonym || 'Видалений',
        username: rec.username  || 'user',
        avatar:   { uri: buildAvatarUri(rec.profileImage) },
    }));

    const mappedFriends: FriendCardData[] = friendsData.map(f => ({
        id:       f.contactProfile.id,
        name:     f.contactProfile.pseudonym || 'Друг',
        username: f.contactProfile.username  || 'friend',
        avatar:   { uri: buildAvatarUri(f.contactProfile.profileImage) },
    }));

    function openProfile(friend: FriendCardData, mode: 'request' | 'recommendation' | 'friend') {
        router.push({
            pathname: '/(friends)/user-profile',
            params:   {
                profileId: String(friend.id),
                name:      friend.name,
                username:  friend.username,
                avatarUrl: friend.avatar.uri,
                mode,
            },
        } as any);
    }

    async function handleConfirm(friend: FriendCardData, mode: 'request' | 'recommendation' | 'friend') {
        if (mode === 'recommendation') {
            try {
                await sendFriendRequest({ receiverProfileId: friend.id }).unwrap();
            } catch (e) {
                console.warn('[Friends] sendFriendRequest error:', e);
            }
            return;
        }
        openProfile(friend, mode);
    }

    async function handleRemove(friend: FriendCardData, mode: 'request' | 'recommendation' | 'friend') {
        if (mode === 'request') {
            try {
                await rejectFriendRequest({ senderProfileId: friend.id }).unwrap();
            } catch (e) {
                console.warn('[Friends] rejectFriendRequest error:', e);
            }
            return;
        }

        if (mode === 'friend') {
            try {
                await removeFriend({ contactProfileId: friend.id }).unwrap();
            } catch (e) {
                console.warn('[Friends] removeFriend error:', e);
            }
            return;
        }
    }

    const renderRequests = () =>
        mappedRequests.map(f => (
            <FriendCard
                key={`req-${f.id}`}
                data={f}
                mode="request"
                onConfirm={() => handleConfirm(f, 'request')}
                onRemove={() => handleRemove(f, 'request')}
            />
        ));

    const renderRecommendations = () =>
        mappedRecommendations.map(f => (
            <FriendCard
                key={`rec-${f.id}`}
                data={f}
                mode="recommendation"
                onConfirm={() => handleConfirm(f, 'recommendation')}
                onRemove={() => handleRemove(f, 'recommendation')}
            />
        ));

    const renderFriends = () =>
        mappedFriends.map(f => (
            <FriendCard
                key={`friend-${f.id}`}
                data={f}
                mode="friend"
                onConfirm={() => handleConfirm(f, 'friend')}
                onRemove={() => handleRemove(f, 'friend')}
            />
        ));

    if (isRecLoading || isReqLoading || isFriendsLoading) {
        return (
            <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#543C52" />
            </View>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'requests':
                return (
                    <FriendSection title="Запити" isEmpty={mappedRequests.length === 0} emptyText="У вас поки немає нових запитів">
                        {renderRequests()}
                    </FriendSection>
                );
            case 'recommendations':
                return (
                    <FriendSection title="Рекомендації" isEmpty={mappedRecommendations.length === 0} emptyText="Рекомендацій поки немає">
                        {renderRecommendations()}
                    </FriendSection>
                );
            case 'all':
                return (
                    <FriendSection title="Всі друзі" isEmpty={mappedFriends.length === 0} emptyText="Список друзів порожній">
                        {renderFriends()}
                    </FriendSection>
                );
            default:
                return (
                    <>
                        <FriendSection title="Запити" isEmpty={mappedRequests.length === 0} emptyText="У вас поки немає нових запитів" onSeeAll={() => setActiveTab('requests')}>
                            {renderRequests()}
                        </FriendSection>
                        <FriendSection title="Рекомендації" isEmpty={mappedRecommendations.length === 0} emptyText="Рекомендацій поки немає" onSeeAll={() => setActiveTab('recommendations')}>
                            {renderRecommendations()}
                        </FriendSection>
                        <FriendSection title="Всі друзі" isEmpty={mappedFriends.length === 0} emptyText="Список друзів порожній" onSeeAll={() => setActiveTab('all')}>
                            {renderFriends()}
                        </FriendSection>
                    </>
                );
        }
    };

    return (
        <View style={styles.screen}>
            <FriendsTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                {renderContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen:        {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    container:     { flex: 1 },
    scrollContent: { paddingBottom: 20 },
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
        flexDirection:     'row',
        justifyContent:    'space-between',
        alignItems:        'center',
        paddingHorizontal: 16,
        marginBottom:      16,
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
    content: { paddingHorizontal: 16 },
});