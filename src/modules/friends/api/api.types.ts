export interface FriendProfile {
    id:               number;
    pseudonym:        string;
    signature:        string | null;
    date:             string | null;
    profileImage:     string | null;
    isImageSignature: boolean;
    isTextSignature:  boolean;
}

export interface CreateFriendRequestPayload {
    receiverProfileId: number;
}

export interface AcceptFriendPayload {
    senderProfileId: number;
}

export interface DeleteFriendPayload {
    contactProfileId: number;
}