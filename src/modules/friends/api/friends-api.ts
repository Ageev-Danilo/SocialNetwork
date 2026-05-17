import { baseApi } from '@/shared/api/base';
import type {
    FriendProfile,
    SendFriendRequestPayload,
    FriendActionPayload,
} from './api.types';

const friendsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getAllProfiles: builder.query<FriendProfile[], void>({
            query: () => ({ url: 'settings/all' }),
            providesTags: ['Friends'],
        }),

        getFriends: builder.query<FriendProfile[], void>({
            query: () => ({ url: 'friends' }),
            providesTags: ['Friends'],
        }),

        getFriendRequests: builder.query<FriendProfile[], void>({
            query: () => ({ url: 'friends/requests' }),
            providesTags: ['FriendRequests'],
        }),

        sendFriendRequest: builder.mutation<{ message: string }, SendFriendRequestPayload>({
            query: (body) => ({
                url:    'friends/request',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['FriendRequests'],
        }),

        addFriend: builder.mutation<{ message: string }, FriendActionPayload>({
            query: (body) => ({
                url:    'friends',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Friends', 'FriendRequests'],
        }),

        removeFriend: builder.mutation<{ message: string }, FriendActionPayload>({
            query: (body) => ({
                url:    'friends',
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['Friends'],
        }),
    }),
});

export const {
    useGetAllProfilesQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useSendFriendRequestMutation,
    useAddFriendMutation,
    useRemoveFriendMutation,
} = friendsApi;