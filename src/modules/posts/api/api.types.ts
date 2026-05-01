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
    date:    string;
    link:    string | null;
    userId:  number;
    media:   PostMedia[];
    tags:    PostTag[];
    likes:   number;
    views:   number;
}

export interface CreatePostPayload {
    title:   string;
    content: string;
    date:    string;
    media:   { url: string }[];
    tags:    { name: string }[];
}