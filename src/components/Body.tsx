import { ScrollView } from 'react-native';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

type BodyProps = {
    children: ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
};

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