import type { MessageDto } from '../api/types';
import type { ThreadItem } from './mock-data';


const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

export function messageDtoToThreadItem(msg: MessageDto, myUserId: number): ThreadItem {
    const time   = new Date(msg.createdAt).toLocaleTimeString('uk-UA', TIME_OPTIONS);
    const isMine = msg.sender.id === myUserId;
    return {
        type: 'message',
        id:   String(msg.id),
        data: {
            id:   String(msg.id),
            text: msg.text ?? '',
            time,
            isMine,
            senderName: isMine ? undefined : (
                [msg.sender.firstName, msg.sender.lastName].filter(Boolean).join(' ')
                || msg.sender.username
                || msg.sender.email
            ),
            status: 'sent',
        },
    };
}

export function buildIncomingItem(message: string, senderName?: string): ThreadItem {
    const id   = `incoming-${Date.now()}`;
    const time = new Date().toLocaleTimeString('uk-UA', TIME_OPTIONS);
    return {
        type: 'message',
        id,
        data: { id, text: message, time, isMine: false, senderName, status: 'sent' },
    };
}