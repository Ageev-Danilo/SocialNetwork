import { View, Text } from 'react-native';
import { Button } from '@/shared/ui';
import { ReactNode } from 'react';

export function Card({
    title,
    children,
    style,
}: {
    title: string;
    children: ReactNode;
    style?: any;
}) {
    return (
        <View style={[{ gap: 12 }, style]}>
            <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{title}</Text>
                <Button icon="edit" />
            </View>
            <View style={{ backgroundColor: 'white', borderRadius: 8, padding: 16 }}>
                {children}
            </View>
        </View>
    );
}
