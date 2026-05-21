import { baseApi } from '@/shared/api/base';
import type {
    FriendProfile,
    CreateFriendRequestPayload,
    AcceptFriendPayload,
    DeleteFriendPayload,
    RejectFriendRequestPayload,
    PublicProfileData,
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

        getPublicProfile: builder.query<PublicProfileData, number>({
            query: (profileId) => ({ url: `friends/profile/${profileId}` }),
            providesTags: ['Friends'],
        }),

        sendFriendRequest: builder.mutation<{ message: string }, CreateFriendRequestPayload>({
            query: (body) => ({ url: 'friends/requests', method: 'POST', body }),
            invalidatesTags: ['FriendRequests', 'Friends'],
        }),

        acceptFriend: builder.mutation<{ message: string }, AcceptFriendPayload>({
            query: (body) => ({ url: 'friends', method: 'POST', body }),
            invalidatesTags: ['Friends', 'FriendRequests'],
        }),

        rejectFriendRequest: builder.mutation<{ message: string }, RejectFriendRequestPayload>({
            query: (body) => ({ url: 'friends/requests', method: 'DELETE', body }),
            invalidatesTags: ['FriendRequests'],
        }),

        removeFriend: builder.mutation<{ message: string }, DeleteFriendPayload>({
            query: (body) => ({ url: 'friends', method: 'DELETE', body }),
            invalidatesTags: ['Friends'],
        }),
    }),
});

export const {
    useGetRecommendationsQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useGetPublicProfileQuery,
    useSendFriendRequestMutation,
    useAcceptFriendMutation,
    useRejectFriendRequestMutation,
    useRemoveFriendMutation,
} = friendsApi;