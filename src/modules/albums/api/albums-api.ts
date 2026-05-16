import { baseApi } from "@/shared/api/base";
import type { AlbumResponse, CreateAlbumPayload, UpdateAlbumPayload } from "./api.types";

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
        updateAlbum: builder.mutation<{ message: string }, UpdateAlbumPayload>({
            query: ({ id, ...body }) => ({
                url:    `/albums/update/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Albums'],
        }),
        deletePhoto: builder.mutation<void, number>({
            query: (id) => ({
                url: `albums/photo/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Albums'],
        }),
    }),
});

export const {
    useGetMyAlbumsQuery,
    useCreateAlbumMutation,
    useUpdateAlbumMutation,
    useDeletePhotoMutation,
} = albumsApi;