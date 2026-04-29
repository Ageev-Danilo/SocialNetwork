export interface SettingsResponse {
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

export type SettingsPayload = FormData;
