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
    avatarUri:        string;
}

export interface GroupChat {
    id:               string;
    name:             string;
    membersCount:     number;
    lastMessage:      string;
    lastMessageTime:  string;
    unreadCount?:     number;
    avatarUri:        string;
}

export interface ChatMessage {
    id:      string;
    text:    string;
    time:    string;
    isMine:  boolean;
}

export const MOCK_CONTACTS: Contact[] = [
    {
        id:        '1',
        name:      'Олена Коваленко',
        username:  'olena_k',
        avatarUri: 'https://i.pravatar.cc/150?u=olena',
        isOnline:  true,
    },
    {
        id:        '2',
        name:      'Андрій Петренко',
        username:  'andriy_p',
        avatarUri: 'https://i.pravatar.cc/150?u=andriy',
        isOnline:  false,
    },
    {
        id:        '3',
        name:      'Марія Іваненко',
        username:  'maria_i',
        avatarUri: 'https://i.pravatar.cc/150?u=maria',
        isOnline:  true,
    },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id:              'dm-1',
        contactId:       '1',
        contactName:     'Олена Коваленко',
        lastMessage:     'Добре, зустрінемось о 18:00',
        lastMessageTime: '14:32',
        unreadCount:     2,
        avatarUri:       'https://i.pravatar.cc/150?u=olena',
    },
    {
        id:              'dm-2',
        contactId:       '2',
        contactName:     'Андрій Петренко',
        lastMessage:     'Надіслав тобі файли',
        lastMessageTime: 'Вчора',
        avatarUri:       'https://i.pravatar.cc/150?u=andriy',
    },
    {
        id:              'dm-3',
        contactId:       '3',
        contactName:     'Марія Іваненко',
        lastMessage:     'Дякую за допомогу!',
        lastMessageTime: '09:15',
        avatarUri:       'https://i.pravatar.cc/150?u=maria',
    },
];

export const MOCK_GROUP_CHATS: GroupChat[] = [
    {
        id:              'grp-1',
        name:            'Команда WIT',
        membersCount:    8,
        lastMessage:     'Іван: Завтра демо о 10:00',
        lastMessageTime: '12:05',
        unreadCount:     5,
        avatarUri:       'https://i.pravatar.cc/150?u=wit-team',
    },
    {
        id:              'grp-2',
        name:            'Дизайн-чат',
        membersCount:    4,
        lastMessage:     'Наталія: Оновила макети у Figma',
        lastMessageTime: 'Пн',
        avatarUri:       'https://i.pravatar.cc/150?u=design',
    },
];

export const MOCK_DM_MESSAGES: Record<string, ChatMessage[]> = {
    'dm-1': [
        { id: '1', text: 'Привіт! Як справи?', time: '14:10', isMine: false },
        { id: '2', text: 'Привіт! Все добре, дякую. Ти вже бачив новий макет?', time: '14:15', isMine: true },
        { id: '3', text: 'Так, виглядає чудово. Можемо зустрітись сьогодні?', time: '14:20', isMine: false },
        { id: '4', text: 'Так, о 18:00 підійде?', time: '14:25', isMine: true },
        { id: '5', text: 'Добре, зустрінемось о 18:00', time: '14:32', isMine: false },
    ],
    'dm-2': [
        { id: '1', text: 'Привіт, чи можеш переглянути документ?', time: '09:00', isMine: true },
        { id: '2', text: 'Зараз подивлюсь', time: '09:15', isMine: false },
        { id: '3', text: 'Надіслав тобі файли', time: '09:40', isMine: false },
    ],
    'dm-3': [
        { id: '1', text: 'Доброго ранку!', time: '08:50', isMine: false },
        { id: '2', text: 'Доброго! Чим можу допомогти?', time: '09:00', isMine: true },
        { id: '3', text: 'Дякую за допомогу!', time: '09:15', isMine: false },
    ],
};

export const MOCK_GROUP_MESSAGES: Record<string, ChatMessage[]> = {
    'grp-1': [
        { id: '1', text: 'Колеги, нагадую про демо завтра', time: '11:00', isMine: false },
        { id: '2', text: 'Дякую за нагадування!', time: '11:30', isMine: true },
        { id: '3', text: 'Іван: Завтра демо о 10:00', time: '12:05', isMine: false },
    ],
    'grp-2': [
        { id: '1', text: 'Хто оновить іконки в макеті?', time: '10:00', isMine: true },
        { id: '2', text: 'Наталія: Оновила макети у Figma', time: '10:45', isMine: false },
    ],
};

export function getConversationById(id: string): Conversation | undefined {
    return MOCK_CONVERSATIONS.find(c => c.id === id);
}

export function getGroupChatById(id: string): GroupChat | undefined {
    return MOCK_GROUP_CHATS.find(g => g.id === id);
}
