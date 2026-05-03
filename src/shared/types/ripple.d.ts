declare module 'react-native-material-ripple' {
    import { Component } from 'react';
    import { TouchableOpacityProps, ViewStyle, StyleProp } from 'react-native';

    export interface RippleProps extends TouchableOpacityProps {
        rippleColor?: string;
        rippleOpacity?: number;
        rippleDuration?: number;
        rippleSize?: number;
        rippleContainerBorderRadius?: number;
        rippleCentered?: boolean;
        rippleSequential?: boolean;
        rippleFades?: boolean;
        disabled?: boolean;
        style?: StyleProp<ViewStyle>;
        onPress?: () => void;
        onLongPress?: () => void;
        onPressIn?: () => void;
        onPressOut?: () => void;
        children?: React.ReactNode;
    }

    export default class Ripple extends Component<RippleProps> {}
}