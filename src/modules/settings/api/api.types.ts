export interface SettingsResponse {
    id:           number;
    pseudonym:    string;
    firstName:    string;
    lastName:     string;
    date:         string;
    username:     string;
    email:        string;
    signature:    string | null;
    profileImage: string | null;
    userId:       number;
    isImageSignature: boolean;
    isTextSignature:  boolean;
}

export type SettingsPayload = FormData;
