import { SettingsSchema } from '@/modules/settings';

export const settingFields: {
    name:   keyof SettingsSchema;
    label:  string;
    holder: string;
    type?:  'text' | 'email' | 'pwd';
}[] = [
    { name: 'firstName', label: "Ім'я",            holder: "Введи ім'я" },
    { name: 'lastName',  label: 'Прізвище',         holder: 'Введи прізвище' },
    { name: 'date',      label: 'Дата народження',  holder: 'дд.мм.рррр' },
    { name: 'pseudonym', label: 'Псевдонім',        holder: 'Введи псевдонім' },
    { name: 'signature', label: 'Підпис',           holder: 'Введи підпис' },
];