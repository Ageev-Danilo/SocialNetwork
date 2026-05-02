import { ReactNode } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import Ripple from 'react-native-material-ripple';

import { BASE } from '../consts';


export default function Button({ type = 'filled', text, onPress, children, style }: { type?: 'filled' | 'outlined' | 'icon', text?: string; onPress?: () => void; children?: ReactNode, style?: StyleProp<ViewStyle> }) {
    const buttonStyle = [
        type === 'filled' && BASE.fill,
        type === 'outlined' && BASE.outline,
        type === 'icon' && BASE.icon,
        style,
    ].filter(Boolean);

    const textStyle = [
        type === 'filled' && BASE.fillText,
        type === 'outlined' && BASE.outlineText,
        type === 'icon' && BASE.iconText,
    ].filter(Boolean);
    
    return (
        <Ripple onPress={onPress} style={[...buttonStyle, BASE.center, style]}>
            <View>
                {children ? children : <Text style={[BASE.btnText, ...textStyle]}>{text}</Text>}
            </View>
        </Ripple>
    );
}

//t