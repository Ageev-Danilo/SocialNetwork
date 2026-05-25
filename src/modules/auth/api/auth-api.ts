import { baseApi } from '@/shared/api/base';
import type {
    RegisterPayload,
    RegisterResponse,
    LoginPayload,
    LoginResponse,
    MeResponse,
    UpdateProfilePayload,
    UserResponse,
    UsernameSuggestionsResponse,
} from './api.types';

const authApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation<LoginResponse, LoginPayload>({
            query: body => ({
                url: 'users/login',
                method: 'POST',
                body,
            }),
        }),
        register: builder.mutation<RegisterResponse, RegisterPayload>({
            query: body => ({
                url: 'users/register',
                method: 'POST',
                body,
            }),
        }),
        me: builder.query<MeResponse, void>({
            query: () => ({ url: 'users/me' }),
        }),
        updateProfile: builder.mutation<UserResponse, UpdateProfilePayload>({
            query: body => ({
                url: 'users/update-profile/',
                method: 'PUT',
                body,
            }),
        }),
        getUsernameSuggestions: builder.mutation<UsernameSuggestionsResponse, { name: string }>({
            query: body => ({
                url: 'users/suggestions/',
                method: 'POST',
                body,
            }),
        }),
    }),
});


export const { useLoginMutation, useRegisterMutation, useMeQuery, useUpdateProfileMutation, useGetUsernameSuggestionsMutation } = authApi;