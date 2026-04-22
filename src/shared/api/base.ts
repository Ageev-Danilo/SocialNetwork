import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { queryBaseHeaders } from './headers';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://10.0.2.2:3000', 
        prepareHeaders: queryBaseHeaders,
    }),
    endpoints() {
        return {};
    },
});