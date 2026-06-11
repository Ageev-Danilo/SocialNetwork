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
                        style={styles.tab}
                        onPress={() => onTabChange(tab.id)}
                    >
                        <Text style={[styles.text, isActive && styles.textActive]}>
                            {tab.label}
                        </Text>
                        {isActive && <View style={styles.underline} />}
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
        paddingTop: 25,
        gap: 18,
        paddingLeft: 19,
        paddingRight: 16,
    },
    tab: {
        alignItems: 'center',
        paddingBottom: 10,
    },
    underline: {
        height: 2,
        width: '100%',
        backgroundColor: '#543C52',
        marginTop: 6,
        borderRadius: 1,
    },
    text: {
        fontSize: 16,
        color: '#81818D',
        fontWeight: '500',
    },
    textActive: {
        color: '#070A1C',
        fontWeight: '700',
    },
});