export type Article = {
    name: string;
    name_en: string;
    slug: string;
    part?: string;
    createdAt: string;
    readingTime: string;
    views: number;
    likes: number;
    category: string;
    subcategory: string;
    pdfPath: string | null;
}

export type Articles = {
    name: string;
    name_en: string;
    slug: string;
    part?: string;
}
