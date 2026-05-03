import { InferType } from 'yup';
import { updateProfileSchema } from '../schemas';

export type UpdateProfileSchema = InferType<typeof updateProfileSchema>;