import { ReactNode } from 'react';
import { StyleProp, ViewStyle, ImageStyle, TextInputProps } from 'react-native';

import AddSvg from '../../assets/add.svg';
import LogoutSvg from '../../assets/logout.svg';
import SettingsSvg from '../../assets/settings.svg';
import HomeSvg from '../../assets/home.svg';
import ImgSvg from '../../assets/img.svg';
import ChatSvg from '../../assets/chat.svg';
import GroupSvg from '../../assets/group.svg';
import CloseSvg from '../../assets/close.svg';
import EditSvg from "../../assets/edit.svg";

export const icons = {
    add: AddSvg,
    logout: LogoutSvg,
    settings: SettingsSvg,
    home: HomeSvg,
    img: ImgSvg,
    chat: ChatSvg,
    group: GroupSvg,
    close: CloseSvg,
    edit: EditSvg,
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
    style?: StyleProp<ViewStyle>;
};

export type BtnProps = {
    type?: 'fill' | 'icon' | 'outline' | 'borderless';
    text?: string;
    icon?: IconName;
    iconSize?: number;
    onPress?: () => void;
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
};

export type TabBtnProps = {
    icon: IconName;
    label?: string;
    href?: string;
    onPress?: () => void;
};

export interface InputProps extends TextInputProps {
    type?: 'pwd' | 'text' | 'email';
    label?: string;
    holder?: string;
    onChangeText?: (text: string) => void;
    value?: string;
}

export type BodyProps = {
    children: ReactNode;
    contentStyle?: StyleProp<ViewStyle>;
};
