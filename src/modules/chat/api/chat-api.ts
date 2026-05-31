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
        addMessage: builder.mutation<{ message: string }, { chatId: number; payload: CreateMessagePayload }>({
            query: ({ chatId, payload }) => ({
                url:    `/chats/${chatId}/messages`,
                method: 'POST',
                body:   payload,
            }),
        }),
        uploadChatImage: builder.mutation<{ path: string }, { uri: string }>({
            async queryFn({ uri }, _api, _extraOptions, baseQuery) {
                const filename = uri.split('/').pop() ?? 'image.jpg';
                const ext      = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
                const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
                const formData = new FormData();
                formData.append('photo', { uri, name: filename, type: mimeType } as any);
                const result = await baseQuery({
                    url:    '/albums/upload-photo',
                    method: 'POST',
                    body:   formData,
                });
                if (result.error) return { error: result.error };
                return { data: result.data as { path: string } };
            },
        }),
    }),
});

export const {
    useGetChatsQuery,
    useCreateChatMutation,
    useGetChatMessagesQuery,
    useAddMessageMutation,
    useUploadChatImageMutation,
} = chatApi;