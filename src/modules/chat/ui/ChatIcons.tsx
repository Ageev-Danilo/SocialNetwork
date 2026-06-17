import Svg, { Path, Circle, Line, Rect } from 'react-native-svg';

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
                strokeWidth="2"
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M6 7.5L9.5 11l7.5-8"
                stroke={color}
                strokeWidth="2"
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

export function MediaIcon({ size = 20, color = '#070A1C' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="2" />
            <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
            <Path 
                d="M21 15l-5-5L5 21" 
                stroke={color} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </Svg>
    );
}

export function PencilIcon({ size = 20, color = '#070A1C' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
            <Path 
                d="M1.66667 13.3333H2.85417L11 5.1875L9.8125 4L1.66667 12.1458V13.3333ZM0 15V11.4583L11 0.479167C11.1667 0.326389 11.3508 0.208333 11.5525 0.125C11.7542 0.0416667 11.9658 0 12.1875 0C12.4092 0 12.6244 0.0416667 12.8333 0.125C13.0422 0.208333 13.2228 0.333333 13.375 0.5L14.5208 1.66667C14.6875 1.81944 14.8092 2 14.8858 2.20833C14.9625 2.41667 15.0006 2.625 15 2.83333C15 3.05556 14.9619 3.2675 14.8858 3.46917C14.8097 3.67083 14.6881 3.85472 14.5208 4.02083L3.54167 15H0ZM10.3958 4.60417L9.8125 4L11 5.1875L10.3958 4.60417Z" 
                fill={color} 
            />
        </Svg>
    );
}

export function TrashIcon({ size = 20, color = '#070A1C' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 15 17" fill="none">
            <Path
                d="M0.832031 4.16659H14.1654M5.83203 7.49992V12.4999M9.16536 7.49992V12.4999M1.66536 4.16659L2.4987 14.1666C2.4987 14.6086 2.67429 15.0325 2.98685 15.3451C3.29941 15.6577 3.72334 15.8333 4.16536 15.8333H10.832C11.2741 15.8333 11.698 15.6577 12.0105 15.3451C12.3231 15.0325 12.4987 14.6086 12.4987 14.1666L13.332 4.16659M4.9987 4.16659V1.66659C4.9987 1.44557 5.0865 1.23361 5.24278 1.07733C5.39906 0.921049 5.61102 0.833252 5.83203 0.833252H9.16536C9.38638 0.833252 9.59834 0.921049 9.75462 1.07733C9.9109 1.23361 9.9987 1.44557 9.9987 1.66659V4.16659"
                stroke={color}
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function LeaveIcon({ size = 20, color = '#070A1C' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path 
                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" 
                stroke={color} 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
        </Svg>
    );
}