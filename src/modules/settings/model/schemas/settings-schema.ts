import * as yup from 'yup';

export const settingsSchema = yup.object({
    firstName: yup.string().required("Обов'язкове поле"),
    lastName:  yup.string().required("Обов'язкове поле"),
    username:  yup.string().min(3, 'Мінімум 3 символи').required("Обов'язкове поле"),
    pseudonym: yup.string().required("Обов'язкове поле"),
    date:      yup.string().required("Обов'язкове поле"),
    signature: yup.string().notRequired().default(''),
});