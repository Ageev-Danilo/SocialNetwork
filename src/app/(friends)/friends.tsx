import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { FriendsTabs } from '@/components/FriendsTabs';

interface SectionProps {
    title: string;
    isEmpty: boolean;
    emptyText: string;
    onSeeAll?: () => void;
    children?: React.ReactNode;
}

const FriendSection = ({ title, isEmpty, emptyText, onSeeAll, children }: SectionProps) => (
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
            <View style={styles.content}>
                {children}
            </View>
        )}
    </View>
);

export default function FriendsScreen() {
    const [activeTab, setActiveTab] = useState('main');
    const renderContent = () => {
        switch (activeTab) {
            case 'requests':
                return (
                    <FriendSection 
                        title="Запити" 
                        isEmpty={true} 
                        emptyText="У вас поки немає нових запитів" 
                    />
                );
            case 'recommendations':
                return (
                    <FriendSection 
                        title="Рекомендації" 
                        isEmpty={true} 
                        emptyText="Рекомендацій поки немає" 
                    />
                );
            case 'all':
                return (
                    <FriendSection 
                        title="Всі друзі" 
                        isEmpty={true} 
                        emptyText="Список друзів порожній" 
                    />
                );
            default: 
                return (
                    <>
                        <FriendSection 
                            title="Запити" 
                            isEmpty={true} 
                            emptyText="У вас поки немає нових запитів" 
                        />
                        <FriendSection 
                            title="Рекомендації" 
                            isEmpty={true} 
                            emptyText="Рекомендацій поки немає" 
                        />
                        <FriendSection 
                            title="Всі друзі" 
                            isEmpty={true} 
                            emptyText="Список друзів порожній" 
                        />
                    </>
                );
        }
    };

    return (
        <View style={styles.screen}>
            <FriendsTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <ScrollView 
                style={styles.container} 
                contentContainerStyle={styles.scrollContent}
            >
                {renderContent()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    cardContainer: {
        backgroundColor: 'white',
        width: '100%', 
        marginTop: 12,
        borderRadius: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EBEBEB',
        paddingVertical: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16, 
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    seeAllText: {
        fontSize: 14,
        color: '#543C52',
        fontWeight: '700',
    },
    emptyContent: {
        paddingHorizontal: 16,
        paddingVertical: 30,
        backgroundColor: 'white', 
        marginHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
    },
    content: {
        paddingHorizontal: 16,
    }
});