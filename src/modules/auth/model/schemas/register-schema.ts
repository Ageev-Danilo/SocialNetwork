import * as yup from 'yup';

export const registerSchema = yup.object({
    email: yup
        .string()
        .email('Введи коректний email')
        .required("Поле обов'язкове"),
    password: yup
        .string()
        .min(8, 'Мінімум 8 символів')
        .required("Поле обов'язкове"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Паролі не співпадають')
        .required("Поле обов'язкове"),
});