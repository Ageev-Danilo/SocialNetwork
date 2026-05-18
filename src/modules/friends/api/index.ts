export {
    useGetRecommendationsQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useSendFriendRequestMutation,
    useAcceptFriendMutation,
    useRemoveFriendMutation,
} from './friends-api';

export type {
    FriendProfile,
    CreateFriendRequestPayload,
    AcceptFriendPayload,
    DeleteFriendPayload,
} from './api.types';

export type {
    ContactWithProfile,
    FriendRequestWithSender,
} from './response.types';