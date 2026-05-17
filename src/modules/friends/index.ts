export { FriendCard }   from './ui/FriendCard';
export type { FriendCardData } from './ui/FriendCard';

export { MOCK_REQUESTS, MOCK_RECOMMENDATIONS, MOCK_FRIENDS } from './ui/mock-data';

export {
    useGetAllProfilesQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useSendFriendRequestMutation,
    useAddFriendMutation,
    useRemoveFriendMutation,
} from './api';

export type {
    FriendProfile,
    SendFriendRequestPayload,
    FriendActionPayload,
} from './api';