export interface ChatDto {
    id:        number;
    createdAt: string;
    updatedAt: string;
}

export interface MessageDto {
    id:        number;
    chatId:    number;
    text:      string | null;
    mediaUrl:  string | null;
    type:      'text' | 'media';
    senderId:  number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateChatPayload {
    memberIds: number[];
}

export interface CreateMessagePayload {
    text?:     string;
    mediaUrl?: string;
    type:      'text' | 'media';
}