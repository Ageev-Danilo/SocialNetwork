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
        }),
        uploadAlbumPhoto: builder.mutation<{ path: string }, { uri: string; albumId: number }>({
            async queryFn({ uri, albumId }, _api, _extraOptions, baseQuery) {
                const formData = new FormData();
                const filename = uri.split('/').pop() ?? 'photo.jpg';
                const ext      = filename.split('.').pop()?.toLowerCase() ?? 'jpg';
                const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

                formData.append('photo', {
                    uri,
                    name: filename,
                    type: mimeType,
                } as any);

                const uploadResult = await baseQuery({
                    url:    '/albums/upload-photo',
                    method: 'POST',
                    body:   formData,
                });

                if (uploadResult.error) return { error: uploadResult.error };

                const { path } = uploadResult.data as { path: string };

                const updateResult = await baseQuery({
                    url:    `/albums/update/${albumId}`,
                    method: 'PATCH',
                    body:   { images: [{ image: path }] },
                });

                if (updateResult.error) return { error: updateResult.error };

                return { data: { path } };
            },
            invalidatesTags: ['Albums'],
        }),
    }),
});

export const {
    useGetMyAlbumsQuery,
    useCreateAlbumMutation,
    useUpdateAlbumMutation,
    useDeletePhotoMutation,
    useUploadAlbumPhotoMutation,
} = albumsApi;