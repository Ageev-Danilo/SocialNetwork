import { ScrollView } from 'react-native';

import { BodyProps } from '@/shared/types/types';


export function Body({ children, contentStyle }: BodyProps) {
    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[{ paddingBottom: 24 }, contentStyle]}
            showsVerticalScrollIndicator={false}
        >
            {children}
        </ScrollView>
    );
}