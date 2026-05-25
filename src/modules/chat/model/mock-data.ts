export interface Contact {
    id:          string;
    name:        string;
    username:    string;
    avatarUri:   string;
    isOnline?:   boolean;
}

export interface Conversation {
    id:               string;
    contactId:        string;
    contactName:      string;
    lastMessage:      string;
    lastMessageTime:  string;
    unreadCount?:     number;
    isOnline?:        boolean;
    highlighted?:     boolean;
    avatarUri:        string;
}

export interface GroupChat {
    id:               string;
    name:             string;
    membersCount:     number;
    onlineCount?:     number;
    lastMessage:      string;
    lastMessageTime:  string;
    unreadCount?:     number;
    avatarUri?:       string;
    initials?:        string;
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ChatMessage {
    id:               string;
    text:             string;
    time:             string;
    isMine:           boolean;
    senderName?:      string;
    senderAvatarUri?: string;
    status?:          MessageStatus;
}

export type ThreadItem =
    | { type: 'date'; id: string; label: string }
    | { type: 'divider'; id: string; label: string }
    | { type: 'message'; id: string; data: ChatMessage };

export const MOCK_CONTACTS: Contact[] = [
    { id: '1', name: 'Jane Cooper',      username: 'jane_c',      avatarUri: 'https://i.pravatar.cc/150?u=jane' },
    { id: '2', name: 'Cameron Williamson', username: 'cameron_w', avatarUri: 'https://i.pravatar.cc/150?u=cameron' },
    { id: '3', name: 'Leslie Alexander', username: 'leslie_a',  avatarUri: 'https://i.pravatar.cc/150?u=leslie' },
    { id: '4', name: 'Robert Fox',       username: 'robert_f',  avatarUri: 'https://i.pravatar.cc/150?u=robert' },
    { id: '5', name: 'Jacob Jones',      username: 'jacob_j',   avatarUri: 'https://i.pravatar.cc/150?u=jacob' },
    { id: '6', name: 'Esther Howard',    username: 'esther_h',  avatarUri: 'https://i.pravatar.cc/150?u=esther' },
    { id: '7', name: 'Ronald Richards',  username: 'ronald_r',  avatarUri: 'https://i.pravatar.cc/150?u=ronald' },
    { id: '8', name: 'Devon Lane',       username: 'devon_l',   avatarUri: 'https://i.pravatar.cc/150?u=devon' },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id:              'dm-1',
        contactId:       '1',
        contactName:     'Mona Lisa',
        lastMessage:     'Привіт! Як справи?',
        lastMessageTime: '09:41',
        isOnline:        true,
        highlighted:     true,
        avatarUri:       'https://i.pravatar.cc/150?u=mona',
    },
    {
        id:              'dm-2',
        contactId:       '2',
        contactName:     'Ann Ti',
        lastMessage:     'Привіт!',
        lastMessageTime: '25.04.2025',
        avatarUri:       'https://i.pravatar.cc/150?u=ann1',
    },
    {
        id:              'dm-3',
        contactId:       '3',
        contactName:     'Ann Ti',
        lastMessage:     'Привіт!',
        lastMessageTime: '25.04.2025',
        avatarUri:       'https://i.pravatar.cc/150?u=ann2',
    },
    {
        id:              'dm-4',
        contactId:       '4',
        contactName:     'Ann Ti',
        lastMessage:     'Привіт!',
        lastMessageTime: '25.04.2025',
        avatarUri:       'https://i.pravatar.cc/150?u=ann3',
    },
    {
        id:              'dm-5',
        contactId:       '5',
        contactName:     'Ann Ti',
        lastMessage:     'Привіт!',
        lastMessageTime: '25.04.2025',
        avatarUri:       'https://i.pravatar.cc/150?u=ann4',
    },
];

export const MOCK_GROUP_CHATS: GroupChat[] = [
    {
        id:              'grp-1',
        name:            'New Group',
        membersCount:    3,
        onlineCount:     1,
        lastMessage:     'Чудово!',
        lastMessageTime: '10:30',
        initials:        'NG',
    },
    {
        id:              'grp-2',
        name:            'Команда WIT',
        membersCount:    8,
        onlineCount:     3,
        lastMessage:     'Іван: Завтра демо о 10:00',
        lastMessageTime: '12:05',
        initials:        'KW',
    },
];

export const MOCK_DM_THREADS: Record<string, ThreadItem[]> = {
    'dm-1': [
        { type: 'date', id: 'd1', label: '25 квітня 2025' },
        { type: 'message', id: 'm1', data: { id: 'm1', text: 'Привіт!', time: '10:01', isMine: true, status: 'read' } },
        { type: 'message', id: 'm2', data: { id: 'm2', text: 'Привіт! Як справи?', time: '10:30', isMine: false, senderName: 'Mona Lisa', senderAvatarUri: 'https://i.pravatar.cc/150?u=mona', status: 'sent' } },
    ],
};

export const MOCK_GROUP_THREADS: Record<string, ThreadItem[]> = {
    'grp-1': [
        { type: 'date', id: 'd1', label: '25 квітня 2025' },
        { type: 'message', id: 'm1', data: { id: 'm1', text: 'Привіт!', time: '10:01', isMine: true, status: 'read' } },
        {
            type: 'message', id: 'm2',
            data: {
                id: 'm2', text: 'Привіт! Як справи?', time: '10:30', isMine: false,
                senderName: 'Wade Warren', senderAvatarUri: 'https://i.pravatar.cc/150?u=wade', status: 'sent',
            },
        },
        { type: 'divider', id: 'div1', label: 'Нові повідомлення' },
        {
            type: 'message', id: 'm3',
            data: {
                id: 'm3', text: 'Чудово!', time: '10:30', isMine: false,
                senderName: 'Cameron Williamson', senderAvatarUri: 'https://i.pravatar.cc/150?u=cameron', status: 'sent',
            },
        },
    ],
    'grp-2': [
        { type: 'date', id: 'd1', label: '24 квітня 2025' },
        { type: 'message', id: 'm1', data: { id: 'm1', text: 'Колеги, нагадую про демо завтра', time: '11:00', isMine: false, senderName: 'Іван', senderAvatarUri: 'https://i.pravatar.cc/150?u=ivan', status: 'sent' } },
        { type: 'message', id: 'm2', data: { id: 'm2', text: 'Дякую за нагадування!', time: '11:30', isMine: true, status: 'delivered' } },
    ],
};

/** @deprecated use MOCK_DM_THREADS */
export const MOCK_DM_MESSAGES: Record<string, ChatMessage[]> = {};

/** @deprecated use MOCK_GROUP_THREADS */
export const MOCK_GROUP_MESSAGES: Record<string, ChatMessage[]> = {};

export const CHAT_TAB_BADGE = 2;

export function getConversationById(id: string): Conversation | undefined {
    return MOCK_CONVERSATIONS.find(c => c.id === id);
}

export function getGroupChatById(id: string): GroupChat | undefined {
    return MOCK_GROUP_CHATS.find(g => g.id === id);
}

export function getDmThread(id: string): ThreadItem[] {
    return MOCK_DM_THREADS[id] ?? [
        { type: 'date', id: 'd1', label: '25 квітня 2025' },
        { type: 'message', id: 'm1', data: { id: 'm1', text: 'Привіт!', time: '10:00', isMine: false, status: 'sent' } },
    ];
}

export function getGroupThread(id: string): ThreadItem[] {
    return MOCK_GROUP_THREADS[id] ?? [];
}

export function getGroupSubtitle(group: GroupChat): string {
    const online = group.onlineCount ?? 0;
    return `${group.membersCount} учасники, ${online} в мережі`;
}
