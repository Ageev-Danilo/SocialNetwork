export type TabItem = {
    label: string;
    href: string;
};

export type TabMenuProps = {
    type?: 'fill' | 'transparent';
    tabs?: TabItem[];
};