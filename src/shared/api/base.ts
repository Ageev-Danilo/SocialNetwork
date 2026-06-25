import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { queryBaseHeaders } from './headers';

const BASE_IP = '10.0.2.2';
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? `http://${BASE_IP}:3000`;

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