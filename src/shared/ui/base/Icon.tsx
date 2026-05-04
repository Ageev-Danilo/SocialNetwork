import { Image } from 'react-native';
import { icons, IconProps, ImgProps } from '../../types/shared.types';

export function Icon({ name, size = 24, style }: IconProps) {
    const Svg = icons[name];
    return <Svg width={size} height={size} />;
}

export function Img({ src, size = 24, style }: ImgProps) {
    return <Image source={src} style={[{ width: size, height: size }, style]} />;
}
