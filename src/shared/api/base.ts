import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { queryBaseHeaders } from './headers';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000';

export const baseApi = createApi({
    reducerPath: 'api',
    tagTypes: ['Settings', 'Posts', 'MyPosts', 'Albums', 'Friends', 'FriendRequests'],
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: queryBaseHeaders,
    }),
    endpoints() {
        return {};
    },
});