import { baseApi } from "@/shared/api/base";
import type { PostResponse, CreatePostPayload} from "./api.types";

const postsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPosts: builder.query<PostResponse[], void>({
            query: () => ({ url: '/main' }),
            providesTags: ['Posts'],
        }),
        getPostById: builder.query<PostResponse[], void>({
            query: (id) => ({ url: `/my-posts` }),
            providesTags: ['MyPosts'],
        }),
        createPost: builder.mutation<{ message:string }, CreatePostPayload>({
            query: (body) => ({
                url: '/create-post',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Posts', 'MyPosts'],
        }),
    }),
});

export const { useGetAllPostsQuery, useGetPostByIdQuery, useCreatePostMutation } = postsApi;
