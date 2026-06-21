export interface SettingsResponse {
    id: number;
    pseudonym: string;
    firstName: string;
    lastName: string;
    date: string;
    username: string;
    email: string;
    signature: string | null;
    profileImage: string | null;
    userId: number;
    isImageSignature: boolean;
    isTextSignature: boolean;
}

export interface UpdateSettingsPayload {
    firstName: string;
    lastName: string;
    pseudonym: string;
    date: string;
    signature?: string;
    isImageSignature: boolean;
    isTextSignature: boolean;
    profileImage?: string;
}

export interface UpdateEmailPayload {
    email: string;
}

export interface UpdatePasswordPayload {
    password: string;
}