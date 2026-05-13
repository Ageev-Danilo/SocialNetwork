import { View, Text } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Icon } from './base/Icon';
import { BASE } from '../consts';
import { BtnProps, TabBtnProps } from '@/shared/types/shared.types';
import { router, usePathname } from 'expo-router';

export function Button({
    type = 'fill',
    text,
    icon,
    iconSize = 20,
    onPress,
    children,
    style,
}: BtnProps) {
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
            ? [...buttonStyle, BASE.center, { overflow: 'hidden' as const }, style]
            : [...buttonStyle, BASE.center, BASE.btn, style];

    return (
        <Ripple onPress={onPress} style={finalStyles}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {icon && <Icon name={icon} size={iconSize} />}

                {children ? (
                    children
                ) : text ? (
                    <Text style={[BASE.btnText, ...textStyle]}>{text}</Text>
                ) : null}
            </View>
        </Ripple>
    );
}

export function TabBtn({ icon, label, href, onPress }: TabBtnProps) {
    const pathname = usePathname();

    const isActive = href ? pathname === href || pathname.startsWith(href + '/') : false;

    const handlePress = () => {
        if (!isActive) {
            if (href) router.push(href as any);
            else if (onPress) onPress();
        }
    };

    return (
        <Ripple onPress={handlePress} style={{ flex: 1, overflow: 'hidden' }}>
            {isActive && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        backgroundColor: '#543C52',
                    }}
                />
            )}
            <View style={[BASE.column, BASE.tab, { height: 60, justifyContent: 'center' }]}>
                <Icon name={icon} />
                {label && (
                    <Text
                        style={[
                            BASE.tabText,
                            { fontSize: 10, textAlign: 'center', opacity: isActive ? 0.8 : 0.5 },
                        ]}
                    >
                        {label}
                    </Text>
                )}
            </View>
        </Ripple>
    );
}
