import type { InferType } from 'yup';
import { settingsSchema } from '../schemas/settings-schema';

export type SettingsSchema = InferType<typeof settingsSchema>;