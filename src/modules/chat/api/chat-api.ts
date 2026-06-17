import { baseApi } from '@/shared/api';
import type { ChatDto, MessageDto, CreateChatPayload, UpdateChatPayload, CreateMessagePayload } from './types';


const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query<ChatDto[], void>({
            query: () => ({ url: '/chats' }),
            providesTags: ['Chats'],
        }),
        createChat: builder.mutation<ChatDto, CreateChatPayload>({
            query: (body) => ({ url: '/chats', method: 'POST', body }),
            invalidatesTags: ['Chats'],
        }),
        updateChat: builder.mutation<ChatDto, { chatId: number; payload: UpdateChatPayload }>({
            query: ({ chatId, payload }) => ({
                url: `/chats/${chatId}`,
                method: 'PUT',
                body: payload,
            }),
            invalidatesTags: ['Chats'],
        }),
        deleteChat: builder.mutation<{ message: string }, number>({
            query: (chatId) => ({ url: `/chats/${chatId}`, method: 'DELETE' }),
            invalidatesTags: ['Chats'],
        }),
        getChatMessages: builder.query<MessageDto[], number>({
            query: (chatId) => ({ url: `/chats/${chatId}/messages` }),
            providesTags: ['Messages'],
        }),
        addMessage: builder.mutation<{ message: string }, { chatId: number; payload: CreateMessagePayload }>({
            query: ({ chatId, payload }) => ({
                url: `/chats/${chatId}/messages`,
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const {
    useGetChatsQuery,
    useCreateChatMutation,
    useUpdateChatMutation,
    useDeleteChatMutation,
    useGetChatMessagesQuery,
    useAddMessageMutation,
} = chatApi;