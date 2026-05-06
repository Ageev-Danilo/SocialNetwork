import { useRouter, useSearchParams } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Button } from '@shared/ui';

export const unstable_settings = {
    presentation: 'modal'
};

export default function EditAlbumModal() {
    const router = useRouter();
    const { albumId } = useSearchParams();

    return (
        <ScrollView contentContainerStyle={styles.overlay}>
            <View style={styles.modal}>
                <Text style={styles.title}>Редагувати альбом</Text>
                <Text style={styles.meta}>ID: {albumId}</Text>

                <View style={styles.field}>
                    <Text style={styles.label}>Назва альбому</Text>
                    <TextInput style={styles.input} value="Ностальгія" placeholderTextColor="#A8A1B7" />
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Обрати тему</Text>
                    <TouchableOpacity style={styles.select}>
                        <Text style={styles.selectText}>Природа</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.field}>
                    <Text style={styles.label}>Рік альбому</Text>
                    <TouchableOpacity style={styles.select}>
                        <Text style={styles.selectText}>2025 рік</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actions}>
                    <Button type="outlined" onPress={() => router.back()}>
                        Скасувати
                    </Button>
                    <Button type="filled" onPress={() => router.back()}>
                        Зберегти
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.12)',
        padding: 16,
    },
    modal: {
        borderRadius: 24,
        backgroundColor: 'white',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
        color: '#1D1B20',
    },
    meta: {
        color: '#6B6773',
        marginBottom: 16,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        color: '#6B6773',
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E3DCE7',
        borderRadius: 16,
        padding: 14,
        backgroundColor: '#F7F5F9',
        color: '#1D1B20',
    },
    select: {
        borderWidth: 1,
        borderColor: '#E3DCE7',
        borderRadius: 16,
        padding: 14,
        backgroundColor: '#F7F5F9',
    },
    selectText: {
        color: '#1D1B20',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 16,
    },
});
