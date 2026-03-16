import { StyleProp, ViewStyle, ImageStyle } from "react-native";

import AddSvg from '../../assets/add.svg';
import LogoutSvg from '../../assets/logout.svg';
import SettingsSvg from '../../assets/settings.svg';
import HomeSvg from '../../assets/home.svg';
import ImgSvg from '../../assets/img.svg';
import ChatSvg from '../../assets/chat.svg';
import GroupSvg from '../../assets/group.svg';


export const icons = {
    add: AddSvg,
    logout: LogoutSvg,
    settings: SettingsSvg,
    home: HomeSvg,
    img: ImgSvg,
    chat: ChatSvg,
    group: GroupSvg,
} as const;

export type IconName = keyof typeof icons;

export type IconProps = {
    name: IconName;
    size?: number;
    style?: StyleProp<ImageStyle>;
};

export type ImgProps = {
    src: any;
    size?: number;
    style?: StyleProp<ImageStyle>;
};

export type NavsProps = {
    route: any;
    style?: StyleProp<ViewStyle>;
}