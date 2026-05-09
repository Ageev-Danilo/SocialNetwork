import { baseApi } from "@/shared/api/base";
import type { AlbumResponse, CreateAlbumPayload } from "./api.types";

const albumsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyAlbums: builder.query<AlbumResponse[], void>({
            query: () => ({ url: '/albums/my-albums' }),
            providesTags: ['Albums'],
        }),
        createAlbum: builder.mutation<{ message: string }, CreateAlbumPayload>({
            query: (body) => ({
                url:    '/albums/create-album',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Albums'],
        }),
    }),
});

export const {
    useGetMyAlbumsQuery,
    useCreateAlbumMutation,
} = albumsApi;