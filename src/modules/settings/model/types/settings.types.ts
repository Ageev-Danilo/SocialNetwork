import type { InferType } from 'yup';
import { settingsSchema, passwordSchema } from '../schemas/settings-schema';

export type SettingsSchema = InferType<typeof settingsSchema>;
export type PasswordSchema = InferType<typeof passwordSchema>;