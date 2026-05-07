export interface AlbumPhoto {
    id:  number;
    uri: string;
}

export interface Album {
    id:     number;
    name:   string;
    theme:  string;
    year:   string;
    photos: AlbumPhoto[];
}

export const MOCK_ALBUMS: Album[] = [
    {
        id:    1,
        name:  'Настрій',
        theme: 'Природа',
        year:  '2025',
        photos: [
            { id: 1, uri: 'https://picsum.photos/seed/a1/300/300' },
            { id: 2, uri: 'https://picsum.photos/seed/a2/300/300' },
            { id: 3, uri: 'https://picsum.photos/seed/a3/300/300' },
        ],
    },
    {
        id:    2,
        name:  'Подорожі',
        theme: 'Подорожі',
        year:  '2024',
        photos: [
            { id: 4, uri: 'https://picsum.photos/seed/b1/300/300' },
        ],
    },
];

export const MOCK_MY_PHOTOS: AlbumPhoto[] = [
    { id: 1, uri: 'https://picsum.photos/seed/profile1/300/300' },
];

export const THEMES = ['Природа', 'Подорожі', "Сім'я", 'Робота', 'Спорт', 'Інше'];
export const YEARS  = ['2022', '2023', '2024', '2025', '2026'];