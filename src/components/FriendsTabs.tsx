import { View, Text, Pressable, StyleSheet } from 'react-native';

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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#543C52',
    },
    text: {
        fontSize: 14,
        color: '#81818D',
        fontWeight: '500',
    },
    textActive: {
        color: '#070A1C',
        fontWeight: '700',
    },
});