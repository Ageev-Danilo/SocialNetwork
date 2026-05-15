import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button } from '@/shared/ui';
import { ReactNode } from 'react';

interface CardProps {
    title:    string;
    children: ReactNode;
    edited:   boolean;
    onSave?:  () => void;
    style?:   StyleProp<ViewStyle>;
}

export function Card({ title, children, edited, onSave, style }: CardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Button
                    type="outline"
                    icon="edit"
                    iconSize={24}
                    text={edited ? 'Зберегти' : ''}
                    style={edited ? styles.saveBtn : styles.editBtn}
                    onPress={edited ? () => onSave?.() : undefined}
                />
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
        borderRadius:    16,
        padding:         16,
        alignItems:      'center',
        gap:             8,
    },
    header: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'center',
        width:          '100%',
    },
    title: {
        fontSize:   18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    editBtn: {
        width:  40,
        height: 40,
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems:    'center',
        backgroundColor: '#E9E5EE',
        padding:       10,
        gap:           10,
    },
});