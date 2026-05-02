import type { User } from '../model';

export interface RegisterPayload {
    email: string;
    password: string;
    username: string;
    name: string;
    surname: string;
}

export interface RegisterResponse {
    token: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export type MeResponse = User;

export type UpdateProfilePayload = {
    pseudonym?: string;
    username?: string;
    avatar?: string;
};

export type UserResponse = {
    id: number;
    email: string;
    username: string;
    pseudonym: string;
};

export type UsernameSuggestionsResponse = {
    suggestions: string[];
};