export interface FriendProfile {
    id:           number;
    pseudonym:    string;
    firstName:    string;
    lastName:     string;
    date:         string;
    username:     string;
    signature:    string | null;
    profileImage: string | null;
    userId:       number;
}

export interface SendFriendRequestPayload {
    targetUserId: number;  
}

export interface FriendActionPayload {
    profile: FriendProfile;  
}