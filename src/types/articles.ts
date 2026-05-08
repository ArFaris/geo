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
    category: string;
}

export type ArticleSearchResult = {
  id: string;
  title: string;
  title_en: string;
  part: string | null;
  category: string;
}

export type ArticleCategory =
    | 'news'
    | 'reviews'
    | 'analytics'
    | 'articles';

export type GroupedArticles = Record<ArticleCategory, Articles[]>;
