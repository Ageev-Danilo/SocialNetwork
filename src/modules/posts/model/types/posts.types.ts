import type { InferType } from "yup";
import { postSchema } from "../schemas/posts-schema";

export type PostSchema = InferType<typeof postSchema>;