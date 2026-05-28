import { baseApi } from '@/shared/api';
import type { ChatDto, MessageDto, CreateChatPayload, CreateMessagePayload } from './types';


const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query<ChatDto[], void>({
            query: () => ({ url: '/chats' }),
            providesTags: ['Chats'],
        }),
        createChat: builder.mutation<ChatDto, CreateChatPayload>({
            query: (body) => ({
                url:    '/chats',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Chats'],
        }),
        getChatMessages: builder.query<MessageDto[], number>({
            query: (chatId) => ({ url: `/chats/${chatId}/messages` }),
            providesTags: ['Messages'],
        }),
        addMessage: builder.mutation<MessageDto, { chatId: number; payload: CreateMessagePayload }>({
            query: ({ chatId, payload }) => ({
                url:    `/chats/${chatId}/messages`,
                method: 'POST',
                body:   payload,
            }),
            invalidatesTags: ['Messages'],
        }),
    }),
});

export const {
    useGetChatsQuery,
    useCreateChatMutation,
    useGetChatMessagesQuery,
    useAddMessageMutation,
} = chatApi;