export interface FriendProfile {
    id:               number;
    username:         string | null;   
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

export interface RejectFriendRequestPayload {
    senderProfileId: number;
}

export interface PublicAlbum {
    id:     number;
    name:   string;
    theme:  string;
    year:   number;
    images: { id: number; image: string }[];
}

// export interface PostMedia {
//     id:     number;
//     url:    string;
//     postId: number;
// }

export interface PublicPost {
    id:        number;
    title:     string;
    content:   string;
    createdAt: string;
    tags:      { id: number; name: string }[];
    likes:     number;
    views:     number;
    // media: PostMedia[];
}

export interface PublicProfileData {
    profile:  FriendProfile;
    albums:   PublicAlbum[];
    lastPost: PublicPost | null;
}

