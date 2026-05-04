import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button, Icon } from '@/shared/ui';
import { ReactNode } from 'react';

export function Card({
    title,
    children,
    style,
}: {
    title: string;
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Button type='outline' icon="edit" style={styles.editBtn} />
            </View>
            <View style={[style, { width: '100%', gap: 16 }]}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    editBtn: {
        width: 40,
        height: 40,
    }
});
