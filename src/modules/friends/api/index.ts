export {
    useGetRecommendationsQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useGetPublicProfileQuery,
    useSendFriendRequestMutation,
    useAcceptFriendMutation,
    useRejectFriendRequestMutation,
    useRemoveFriendMutation,
} from './friends-api';

export type {
    FriendProfile,
    CreateFriendRequestPayload,
    AcceptFriendPayload,
    DeleteFriendPayload,
    RejectFriendRequestPayload,
    PublicProfileData,
    PublicAlbum,
    PublicPost,
} from './api.types';

export type {
    ContactWithProfile,
    FriendRequestWithSender,
} from './response.types';