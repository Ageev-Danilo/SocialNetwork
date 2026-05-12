export interface AlbumPhotoResponse {
    id:      number;
    url:     string;
    albumId: number;
}

export interface AlbumResponse {
    id:     number;
    name:   string;
    date:   string;
    theme:  string;
    userId: number;
    user:   { id: number; email: string };
    photos: AlbumPhotoResponse[];
}

export interface CreateAlbumPayload {
    name:  string;
    date:  string;
    theme: string;
}