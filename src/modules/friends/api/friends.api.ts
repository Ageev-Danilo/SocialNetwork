import { baseApi } from '@/shared/api/base';

export const friendsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getFriends: builder.query<any, void>({
            query: () => ({ url: 'friends' }),
            providesTags: ['Friends' as any],
        }),
        sendFriendRequest: builder.mutation<{ message: string }, { receiverId: number }>({
            query: body => ({
                url: 'friends/request',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Friends' as any],
        }),
    }),
});

export const { useGetFriendsQuery, useSendFriendRequestMutation } = friendsApi;