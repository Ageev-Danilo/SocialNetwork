import { baseApi } from "@/shared/api/base";
import type { PostResponse, CreatePostPayload } from "./api.types";

const postsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPosts: builder.query<PostResponse[], void>({
            query: () => ({ url: '/posts/main' }),
            providesTags: ['Posts'],
        }),
        getMyPosts: builder.query<PostResponse[], void>({
            query: () => ({ url: '/posts/my-posts' }),
            providesTags: ['MyPosts'],
        }),
        createPost: builder.mutation<{ message: string }, CreatePostPayload>({
            query: (body) => ({
                url: '/posts/create-post',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Posts', 'MyPosts'],
        }),
    }),
});

export const {
    useGetAllPostsQuery,
    useGetMyPostsQuery,
    useCreatePostMutation,
} = postsApi;