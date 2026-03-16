import { ReactNode } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import Ripple from 'react-native-material-ripple';

import { BASE } from '../consts';


export default function Button({ type = 'fill', text, onPress, children, style }: { type?: 'fill' | 'icon' | 'outline', text?: string; onPress?: () => void; children?: ReactNode, style?: StyleProp<ViewStyle> }) {
    const buttonStyle = [
        type === 'fill' && BASE.fill,
        type === 'icon' && BASE.icon,
        type === 'outline' && BASE.outline,
        style,
    ].filter(Boolean);

    const textStyle = [
        type === 'fill' && BASE.fillText,
        type === 'icon' && BASE.iconText,
        type === 'outline' && BASE.outlineText,
    ].filter(Boolean);
    
    return (
        <Ripple onPress={onPress} style={[buttonStyle, BASE.center, BASE.btn, style]}>
            <View>
                {children ? children : <Text style={[BASE.btnText, textStyle]}>{text}</Text>}
            </View>
        </Ripple>
    );
}