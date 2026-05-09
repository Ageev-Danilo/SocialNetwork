import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

const FRIENDS_TABS = [
    { label: 'Головна', id: 'main' },
    { label: 'Запити', id: 'requests' },
    { label: 'Рекомендації', id: 'recommendations' },
    { label: 'Всі друзі', id: 'all' },
];

interface Props {
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function FriendsTabs({ activeTab, onTabChange }: Props) {
    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {FRIENDS_TABS.map((tab) => {
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
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F6', 
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
    },
    tab: {
        paddingVertical: 16, 
        paddingHorizontal: 16,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#543C52',
    },
    text: {
        fontSize: 15, 
        color: '#999',
        fontWeight: '700',
    },
    textActive: {
        color: '#543C52',
        fontWeight: '700',
    },
});