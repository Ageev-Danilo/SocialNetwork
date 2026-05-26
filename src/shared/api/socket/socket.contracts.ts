export type JoinChatCallback = (
    response: { status: "ok" } | { status: "error"; message?: string },
) => void;

export interface SendMessagePayload {
    text?: string;
    mediaUrl?: string;
    chatId: number;
    type: "text" | "media";
}

type Message = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    chatId: number;
    type: string;
    text: string | null;
    mediaUrl: string | null;
    lastChatId: number;
    senderId: number;
};

export interface JoinChatPayload {
    chatId: number;
}

export interface LeaveChatPayload {
    chatId: number;
}

export type GetOnlineUsersPayload = {
    userIds: number[];
};

export type GetOnlineUsersAcknowledgment = (response: { userIds: number[] }) => void;

export interface ServerEvents {
    newChatMessage: (message: Message) => void;
}

export interface ClientEvents {
    joinChat: (payload: JoinChatPayload, ack?: JoinChatCallback) => void;
    leaveChat: (payload: LeaveChatPayload) => void;
    sendMessage: (payload: SendMessagePayload) => void;
    getOnlineUsers: (payload: GetOnlineUsersPayload, ack?: GetOnlineUsersAcknowledgment) => void;
}