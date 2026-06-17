import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { queryBaseHeaders } from './headers';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.0.152:3000';

export const baseApi = createApi({
    reducerPath: 'api',
    tagTypes: ['Settings', 'Posts', 'MyPosts', 'Albums', 'Friends', 'FriendRequests', 'Chats', 'Messages', 'Profiles'],
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,
        prepareHeaders: queryBaseHeaders,
    }),
    endpoints() {
        return {};
    },
});