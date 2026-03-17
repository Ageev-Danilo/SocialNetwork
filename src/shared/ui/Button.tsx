import { View, Text } from 'react-native';
import Ripple from 'react-native-material-ripple';

import { Icon } from './base/Icon';
import { BASE } from '../consts';

import { BtnProps, TabBtnProps } from '@/shared/types/types';
import { router, usePathname } from 'expo-router';

export function Button({ type = 'fill', text, onPress, children, style }: BtnProps) {
    const buttonStyle = [
        type === 'fill' && BASE.fill,
        type === 'icon' && BASE.icon,
        type === 'outline' && BASE.outline,
        type === 'borderless' && BASE.borderless,
    ].filter(Boolean);

    const textStyle = [
        type === 'fill' && BASE.fillText,
        type === 'icon' && BASE.iconText,
        type === 'outline' && BASE.outlineText,
    ].filter(Boolean);

    const finalStyles =
        type === 'borderless'
            ? [...buttonStyle, BASE.center, { overflow: 'hidden' }, style]
            : [...buttonStyle, BASE.center, BASE.btn, style];

    return (
        <Ripple onPress={onPress} style={finalStyles}>
            <View>
                {children ? children : <Text style={[BASE.btnText, ...textStyle]}>{text}</Text>}
            </View>
        </Ripple>
    );
}

export function TabBtn({ icon, label, href, onPress }: TabBtnProps) {
    const pathname = usePathname();

    const isActive = href ? pathname.endsWith(href) : false;

    const handlePress = () => {
        if (!isActive) {
            if (href) {
                router.push(href);
            } else if (onPress) {
                onPress();
            }
        }
    };

    return (
        <Button type="borderless" onPress={handlePress} style={[isActive && BASE.tabActive]}>
            <View style={[BASE.column, BASE.tab]}>
                <Icon name={icon} />
                {label && (
                    <Text style={{ opacity: isActive ? 0.8 : 0.6, textAlign: 'center' }}>
                        {label}
                    </Text>
                )}
            </View>
        </Button>
    );
}
