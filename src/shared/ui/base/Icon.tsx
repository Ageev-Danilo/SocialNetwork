import { Image } from 'react-native';
import { icons, IconProps, ImgProps } from '../../types/shared.types';

const createIcon =
    (Svg: any) =>
    ({ size = 24, fill, stroke, style }: IconProps) => (
        <Svg
            width={size}
            height={size}
            fill={fill ?? 'none'}
            stroke={stroke ?? 'none'}
            style={style}
        />
    );

export const Icon = {
    add: createIcon(icons.add),
    logout: createIcon(icons.logout),
    settings: createIcon(icons.settings),
    home: createIcon(icons.home),
    chat: createIcon(icons.chat),
    group: createIcon(icons.group),
    close: createIcon(icons.close),
    edit: createIcon(icons.edit),
    visible: createIcon(icons.visible),
    hide: createIcon(icons.hide),
    camera: createIcon(icons.camera),
    send: createIcon(icons.send),
    smile: createIcon(icons.smile),
    img: createIcon(icons.img),
};

export function Img({ src, size = 24, style }: ImgProps) {
    return <Image source={src} style={[{ width: size, height: size }, style]} />;
}