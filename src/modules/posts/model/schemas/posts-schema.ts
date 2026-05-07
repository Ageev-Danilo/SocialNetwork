import * as yup from 'yup';

export const postSchema = yup.object({
    title:   yup.string().required("Обов'язкове поле"),
    topic:   yup.string().optional(),
    content: yup.string().required("Обов'язкове поле"),
    link:    yup.string().url("Невірне посилання").optional(),
});