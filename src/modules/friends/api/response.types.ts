import type { FriendProfile } from './api.types';

export interface ContactWithProfile {
    id:               number;
    ownerProfileId:   number;
    contactProfileId: number;
    contactProfile:   FriendProfile;
}

export interface FriendRequestWithSender {
    id:         number;
    createdAt:  string;
    senderId:   number;
    receiverId: number;
    sender:     FriendProfile;
}