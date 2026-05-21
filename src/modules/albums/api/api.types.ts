export interface AlbumImageResponse {
    id:      number;
    image:   string;      
    albumId: number;
    isShown: boolean;
    createdAt: string;
}

export interface AlbumResponse {
    id:        number;
    name:      string;
    year:      number;   
    theme:     string;
    profileId: number;   
    isShown:   boolean;
    isDefault: boolean;
    images:    AlbumImageResponse[];  
}

export interface CreateAlbumPayload {
    name:  string;
    year:  number;        
    theme: string;
}

export interface UpdateAlbumPayload {
    id:      number;
    name?:   string;
    year?:   number;
    theme?:  string;
    images?: { image: string }[];  
}

export type AlbumPhotoResponse = AlbumImageResponse;