import * as yup from 'yup';

export const updateProfileSchema = yup.object({
    pseudonym: yup
        .string()
        .min(4, 'Мінімум 4 символи')
        .max(20, 'Максимум 20 символів')
        .required("Поле обов'язкове"),
    username: yup
        .string()
        .min(4, 'Мінімум 4 символи')
        .max(20, 'Максимум 20 символів')
        .required("Поле обов'язкове"),
});