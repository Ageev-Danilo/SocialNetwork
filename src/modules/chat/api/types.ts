export interface ChatUser {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    profileImage: string | null;  
}

export interface ChatDto {
    id: number;
    name: string | null;
    isGroup: boolean;
    avatar: string | null;
    adminId: number | null;
    users: ChatUser[];
}

export interface MessageDto {
    id: number;
    text: string;
    createdAt: Date;
    sender: ChatUser;
}

export interface CreateChatPayload {
    memberIds: number[];
    isGroup?: boolean;
    name?: string;
}
export interface CreateMessagePayload {
    text: string;
}

export interface UpdateChatPayload {
    name?: string | null;
    avatar?: string | null;
    memberIds?: number[];
}