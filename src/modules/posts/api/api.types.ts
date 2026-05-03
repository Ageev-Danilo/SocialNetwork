export interface PostUser {
    id:    number;
    email: string;
}

export interface PostMedia {
    id:     number;
    url:    string;
    postId: number;
}

export interface PostTag {
    id:   number;
    name: string;
}

export interface PostResponse {
    id:      number;
    title:   string;
    content: string;
    link:    string | null;
    userId:  number;
    user:    PostUser;
    media:   PostMedia[];
    tags:    PostTag[];
    likes:   number;
    views:   number;
}

export interface CreatePostPayload {
    title:   string;
    content: string;
    link?:   string;
    media:   { url: string }[];
    tags:    { name: string }[];
}