export {
    useGetAllProfilesQuery,
    useGetFriendsQuery,
    useGetFriendRequestsQuery,
    useSendFriendRequestMutation,
    useAddFriendMutation,
    useRemoveFriendMutation,
} from './friends-api';

export type {
    FriendProfile,
    SendFriendRequestPayload,
    FriendActionPayload,
} from './api.types';