import { View, Text, StyleSheet } from 'react-native';
import { UpdateProfileForm } from '@/modules/auth/ui/update-profile-form/form';
import { Button, Input } from '@/shared/ui';

import { router } from 'expo-router';

export default function ModalScreen() {
    return (
        <View style={styles.overlay}>
            <View style={styles.modal}>
                <View style={styles.close}>
                    <Button
                        type='icon'
                        icon="close"
                        iconSize={17}
                        style={styles.closeBtn}
                        onPress={() => router.back()}
                    />
                </View>

                <Text style={styles.title}>Додай деталі про себе</Text>

                <UpdateProfileForm styles={styles} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 15,
    },
    modal: {
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 24,
        borderRadius: 20,
    },
    close: {
        alignItems: 'flex-end',
    },
    closeBtn: {
        width: 47,
    },
    title: {
        fontWeight: '500',
        fontSize: 24,
        textAlign: 'center',
    },
    content: {
        height: 270,
        paddingVertical: 24,
        gap: 24,
    },
    label: {
        fontSize: 16,
    },
    container: {
        gap: 6,
    },
    suggested: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 4,
        flexWrap: 'wrap',
    },
    suggestedText: {
        color: '#22C55E',
        flex: 1,
        flexShrink: 1,
        lineHeight: 20,
    },
    error: {
        color: '#E53935',
        fontSize: 12,
    },
    next: {
        alignItems: 'flex-end',
    },
});
