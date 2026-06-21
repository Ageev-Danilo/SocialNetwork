import type { InferType } from 'yup';
import { settingsSchema, passwordSchema, emailSchema } from '../schemas/settings-schema';


export type SettingsSchema = InferType<typeof settingsSchema>;
export type PasswordSchema = InferType<typeof passwordSchema>;
export type EmailSchema = InferType<typeof emailSchema>;