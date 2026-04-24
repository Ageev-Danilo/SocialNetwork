import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '@/shared/ui';

interface Props {
    onEdit: () => void;
}

export function ProfileCard({ onEdit }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Картка профілю</Text>
                <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
                    <Icon name="settings" size={16} />
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <View style={styles.avatarWrap}>
                    <Image
                        source={require('../../../assets/group.svg')}
                        style={styles.avatar}
                    />
                </View>
                <Text style={styles.name}>Ім'я Прізвище</Text>
                <Text style={styles.username}>@username</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#070A1C',
    },
    editBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#CDCED2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        alignItems: 'center',
        gap: 6,
    },
    avatarWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        marginBottom: 8,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 17,
        fontWeight: '600',
        color: '#070A1C',
    },
    username: {
        fontSize: 14,
        color: '#888',
    },
});