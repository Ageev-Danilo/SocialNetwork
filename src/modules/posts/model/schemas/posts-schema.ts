import * as yup from 'yup';

export const postSchema = yup.object({
    title: yup.string().required("Обовязкове поле"),
    content: yup.string().required("Обовязкове поле"),
    date: yup.string().required("Обовязкове поле"),
});