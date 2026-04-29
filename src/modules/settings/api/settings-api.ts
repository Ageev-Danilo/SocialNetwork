import { baseApi } from '@/shared/api/base';
import type { SettingsResponse } from './api.types';

const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query<SettingsResponse, void>({
            query: () => ({ url: 'settings' }),
            providesTags: ['Settings'], 
        }),
        updateSettings: builder.mutation<{ message: string }, FormData>({
            query: (body) => ({
                url:      'settings',
                method:   'POST',
                body,
                formData: true,
            }),
            invalidatesTags: ['Settings'], 
        }),
    }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;