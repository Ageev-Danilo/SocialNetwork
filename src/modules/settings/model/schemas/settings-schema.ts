import * as yup from 'yup';

export const settingsSchema = yup.object({
    firstName: yup.string().required("Обов'язкове поле"),
    lastName:  yup.string().required("Обов'язкове поле"),
    pseudonym: yup.string().required("Обов'язкове поле"),
    date:      yup.string().required("Обов'язкове поле"),
    signature: yup.string().notRequired().default(''),
});

export const passwordSchema = yup.object({
    password: yup.string().min(6, 'Мінімум 6 символів').required("Обов'язкове поле"),
});