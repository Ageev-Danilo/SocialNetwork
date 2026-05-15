import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useGetFriendsQuery } from '@/modules/friends/api/friends.api';
import FriendCard from '@/modules/friends/ui/FriendCard';
import AddFriendModal from '@/modules/friends/ui/AddFriendModal';
import Button from '@/shared/ui/Button';

export default function FriendsScreen() {
    const [isModalVisible, setModalVisible] = useState(false);
    const { data: friends, isLoading } = useGetFriendsQuery();

    return (
        <View style={styles.container}>
            <Button text="Додати друга по ID" onPress={() => setModalVisible(true)} style={styles.addBtn} />
            
            {isLoading ? (
                <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />
            ) : (
                <FlatList 
                    data={friends}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <FriendCard friend={item} />}
                    contentContainerStyle={styles.list}
                />
            )}

            <AddFriendModal visible={isModalVisible} onClose={() => setModalVisible(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    addBtn: {
        marginBottom: 16,
    },
    list: {
        paddingBottom: 20,
    },
});