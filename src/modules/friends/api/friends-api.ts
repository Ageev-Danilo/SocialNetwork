import { baseApi } from '@/shared/api/base';
import type {
    FriendProfile,
    CreateFriendRequestPayload,
    AcceptFriendPayload,
    DeleteFriendPayload,
} from './api.types';
import type { ContactWithProfile, FriendRequestWithSender } from './response.types';

const friendsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getRecommendations: builder.query<FriendProfile[], void>({
            query: () => ({ url: 'friends/recommendations' }),
            providesTags: ['Friends'],
        }),

        getFriends: builder.query<ContactWithProfile[], void>({
            query: () => ({ url: 'friends' }),
            providesTags: ['Friends'],
        }),

        getFriendRequests: builder.query<FriendRequestWithSender[], void>({
            query: () => ({ url: 'friends/requests' }),
            providesTags: ['FriendRequests'],
        }),
        sendFriendRequest: builder.mutation<{ message: string }, CreateFriendRequestPayload>({
            query: (body) => ({
                url:    'friends/requests',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['FriendRequests'],
        }),

        acceptFriend: builder.mutation<{ message: string }, AcceptFriendPayload>({
            query: (body) => ({
                url:    'friends',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Friends', 'FriendRequests'],
        }),

        removeFriend: builder.mutation<{ message: string }, DeleteFriendPayload>({
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
    useGetRecommendationsQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useSendFriendRequestMutation,
    useAcceptFriendMutation,
    useRemoveFriendMutation,
} = friendsApi;