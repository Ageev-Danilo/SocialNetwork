import { InferType } from 'yup';
import { registerSchema } from '../schemas';

export type RegisterSchema = InferType<typeof registerSchema>;