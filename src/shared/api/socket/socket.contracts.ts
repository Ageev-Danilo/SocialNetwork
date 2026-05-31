export type JoinChatCallback    = (response: { joined: boolean }) => void;
export type LeaveChatCallback   = (response: { left: boolean }) => void;
export type SendMessageCallback = (response: { delivered: boolean }) => void;

export interface SendMessagePayload {
    chatId:  string;
    message: string;
}

export interface NewMessageData {
    userId:  string;
    message: string;
    chatId:  string;
}

export interface ServerEvents {
    'chat:new-message':  (data: NewMessageData) => void;
    'user:connected':    (userId: string) => void;
    'user:disconnected': (userId: string) => void;
}

export interface ClientEvents {
    'chat:join':    (chatId: string, ack?: JoinChatCallback) => void;
    'chat:leave':   (chatId: string, ack?: LeaveChatCallback) => void;
    'chat:message': (payload: SendMessagePayload, ack?: SendMessageCallback) => void;
    'user:online':  (userId: string, ack?: (response: { success: boolean }) => void) => void;
    'user:offline': (userId: string, ack?: (response: { success: boolean }) => void) => void;
}