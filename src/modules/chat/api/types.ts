export interface ChatUser {
    id:           number;
    email:        string;
    username:     string | null;
    profile: {
        profileImage: string | null;
    } | null;
}

export interface ChatDto {
    id:      number;
    name:    string | null;
    isGroup: boolean;
    avatar:  string | null;
    adminId: number | null;
    users:   ChatUser[];
}

export interface MessageDto {
    id:        number;
    text:      string;
    createdAt: Date;
    sender:    ChatUser;
}

export interface CreateChatPayload {
    memberIds: number[];
}

export interface CreateMessagePayload {
    text: string;
}