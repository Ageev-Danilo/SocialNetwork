export { FriendCard }   from './ui/FriendCard';
export type { FriendCardData } from './ui/FriendCard';

export { MOCK_REQUESTS, MOCK_RECOMMENDATIONS, MOCK_FRIENDS } from './ui/mock-data';

export {
    useGetRecommendationsQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useSendFriendRequestMutation,
    useAcceptFriendMutation,
    useRemoveFriendMutation,
} from './api';

export type {
    FriendProfile,
    CreateFriendRequestPayload,
    AcceptFriendPayload,
    DeleteFriendPayload,
    ContactWithProfile,
    FriendRequestWithSender,
} from './api';