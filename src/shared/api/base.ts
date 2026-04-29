import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { queryBaseHeaders } from './headers';

export const baseApi = createApi({
    reducerPath: 'api',
    tagTypes: ['Settings'], 
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://192.168.1.100:3000',
        prepareHeaders: queryBaseHeaders,
    }),
    endpoints() {
        return {};
    },
});