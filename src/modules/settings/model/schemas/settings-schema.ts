import * as yup from 'yup';


export const settingsSchema = yup.object({
    firstName: yup.string().required("Обов'язкове поле"),
    lastName: yup.string().required("Обов'язкове поле"),
    pseudonym: yup.string().required("Обов'язкове поле"),
    date: yup.string().required("Обов'язкове поле"),
    signature: yup.string().notRequired().default(''),
});

export const passwordSchema = yup.object({
    password: yup.string().defined().test('min-if-present', 'Мінімум 6 символів', value => {
        if (!value) return true;
        return value.length >= 6;
    }),
});

export const emailSchema = yup.object({
    email: yup.string().email('Невірний формат email').required("Обов'язкове поле"),
});