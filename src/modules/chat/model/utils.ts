import type { MessageDto } from '../api/types';
import type { ThreadItem }  from './mock-data';

const TIME_OPTIONS: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
const DATE_OPTIONS: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

export function messageDtoToThreadItem(msg: MessageDto, myUserId: number): ThreadItem {
    const time = new Date(msg.createdAt).toLocaleTimeString('uk-UA', TIME_OPTIONS);
    const isMine = msg.sender.id === myUserId;
    return {
        type: 'message',
        id: String(msg.id),
        data: {
            id: String(msg.id),
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
    const id = `incoming-${Date.now()}`;
    const time = new Date().toLocaleTimeString('uk-UA', TIME_OPTIONS);
    return {
        type: 'message',
        id,
        data: { id, text: message, time, isMine: false, senderName, status: 'sent' },
    };
}

export function buildThreadItemsWithDates(msgs: MessageDto[], myUserId: number): ThreadItem[] {
    const result: ThreadItem[] = [];
    let lastDateStr = '';
    for (const msg of msgs) {
        const raw = new Date(msg.createdAt).toLocaleDateString('uk-UA', DATE_OPTIONS);
        const dateStr = raw.replace(/\s*р\.$/, '').trim();
        if (dateStr !== lastDateStr) {
            lastDateStr = dateStr;
            result.push({ type: 'date', id: `date-sep-${msg.id}`, label: dateStr } as ThreadItem);
        }
        result.push(messageDtoToThreadItem(msg, myUserId));
    }
    return result;
}