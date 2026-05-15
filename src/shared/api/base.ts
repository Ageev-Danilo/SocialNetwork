import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { queryBaseHeaders } from './headers';


export const baseApi = createApi({
    reducerPath: 'api',
    tagTypes: ['Settings', 'Posts', 'MyPosts', 'Albums', 'Friends'], 
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://192.168.178.23:3000', 
        prepareHeaders: queryBaseHeaders,
    }),
    endpoints() {
        return {};
    },
})