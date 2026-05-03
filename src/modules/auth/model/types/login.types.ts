import { InferType } from 'yup';
import { loginSchema } from '../schemas';

export type LoginSchema = InferType<typeof loginSchema>;