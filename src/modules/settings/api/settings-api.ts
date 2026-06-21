import { baseApi } from '@/shared/api/base';
import type { SettingsResponse, UpdateSettingsPayload, UpdateEmailPayload, UpdatePasswordPayload } from './api.types';


const settingsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getSettings: builder.query<SettingsResponse, void>({
            query: () => ({ url: 'settings' }),
            providesTags: ['Settings'],
        }),
        updateSettings: builder.mutation<{ message: string }, UpdateSettingsPayload>({
            query: body => ({
                url: 'settings',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Settings'],
        }),
        updateEmail: builder.mutation<{ message: string }, UpdateEmailPayload>({
            query: body => ({
                url: 'settings/email',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Settings'],
        }),
        updatePassword: builder.mutation<{ message: string }, UpdatePasswordPayload>({
            query: body => ({
                url: 'settings/password',
                method: 'PATCH',
                body,
            }),
        }),
    }),
});

export const {
    useGetSettingsQuery,
    useUpdateSettingsMutation,
    useUpdateEmailMutation,
    useUpdatePasswordMutation,
} = settingsApi;