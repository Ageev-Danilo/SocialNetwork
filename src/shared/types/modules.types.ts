import { Control, FieldValues, Path } from 'react-hook-form';


export type SettingFieldProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label: string;
    holder?: string;
    type?: 'pwd' | 'text' | 'email';
};