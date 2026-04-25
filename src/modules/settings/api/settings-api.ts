import { baseApi } from '@/shared/api/base';
import type { SettingsResponse, SettingsPayload } from './api.types';

const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query<SettingsResponse, void>({
            query: () => ({ url: 'settings' }),
        }),
        updateSettings: builder.mutation<{ message: string }, SettingsPayload>({
            query: (body) => ({
                url:    'settings',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;