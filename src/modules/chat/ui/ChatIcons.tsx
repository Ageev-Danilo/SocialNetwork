import Svg, { Path, Circle, Line } from 'react-native-svg';


interface IconProps {
    size?:  number;
    color?: string;
}


export function SearchIcon({ size = 20, color = '#81818D' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2" />
            <Path d="M20 20L16.5 16.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </Svg>
    );
}

export function UserAddIcon({ size = 22, color = '#543C52' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="9" cy="8" r="4" stroke={color} strokeWidth="1.8" />
            <Path d="M3 20c0-3.3 2.7-6 6-6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            <Path d="M19 8v8M15 12h8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </Svg>
    );
}

export function MenuDotsIcon({ size = 20, color = '#070A1C' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="5" r="1.5" fill={color} />
            <Circle cx="12" cy="12" r="1.5" fill={color} />
            <Circle cx="12" cy="19" r="1.5" fill={color} />
        </Svg>
    );
}

export function CheckSingleIcon({ size = 14, color = '#81818D' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <Path
                d="M2.5 8.5L6 12l7.5-8"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function CheckDoubleIcon({ size = 14, color = '#543C52' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 18 14" fill="none">
            <Path
                d="M1 7.5L4.5 11l4-4"
                stroke={color}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6 7.5L9.5 11l7.5-8"
                stroke={color}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function BackIcon({ size = 22, color = '#070A1C' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M15 6l-6 6 6 6"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function MessagesTabIcon({ size = 20, color = '#543C52' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <Path
                d="M2.5 10a7.5 7.5 0 0115 0v4.8c0 .8 0 1.2-.16 1.5a1.5 1.5 0 01-.66.66c-.3.16-.7.16-1.5.16H10A7.5 7.5 0 012.5 10z"
                stroke={color}
                strokeWidth="1.6"
            />
            <Path d="M7.2 9.1h5.6M10 12.8h2.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        </Svg>
    );
}

export function NewMessagesDivider() {
    return (
        <Svg width="100%" height={20} viewBox="0 0 300 20" preserveAspectRatio="none">
            <Line x1="0" y1="10" x2="300" y2="10" stroke="#EBEBEB" strokeWidth="1" />
        </Svg>
    );
}