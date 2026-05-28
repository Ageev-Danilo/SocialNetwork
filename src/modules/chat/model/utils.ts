import type { MessageDto } from '../api/types';
import type { ThreadItem } from './mock-data';


export function messageDtoToThreadItem(msg: MessageDto, myProfileId: number): ThreadItem {
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const time = new Date(msg.createdAt).toLocaleTimeString('uk-UA', timeOptions);
    const isMine = msg.senderId === myProfileId;

    return {
        type: 'message',
        id: String(msg.id),
        data: {
            id: String(msg.id),
            text: msg.text ?? '',
            time,
            isMine,
            senderName: isMine ? undefined : msg.sender.username,
            status: 'sent',
        },
    };
}

export function buildOptimisticItem(text: string): ThreadItem {
    const id = `optimistic-${Date.now()}`;
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const time = new Date().toLocaleTimeString('uk-UA', timeOptions);

    return {
        type: 'message',
        id,
        data: { id, text, time, isMine: true, status: 'sent' },
    };
}

export function buildIncomingItem(message: string): ThreadItem {
    const id = `incoming-${Date.now()}`;
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
    const time = new Date().toLocaleTimeString('uk-UA', timeOptions);

    return {
        type: 'message',
        id,
        data: { id, text: message, time, isMine: false, status: 'sent' },
    };
}