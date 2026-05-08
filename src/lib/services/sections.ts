import { createClient } from '@/lib/supabase/server';

import {
    Article,
    ArticleCategory,
} from '@/types/articles';

type GetArticlesBySectionParams = {
    category?: ArticleCategory;
    subcategory?: string;

    section?: string;
    subsection?: string;
};

export const getArticles = async ({
    category,
    subcategory,

    section,
    subsection,
}: GetArticlesBySectionParams): Promise<Article[]> => {
    const supabase = await createClient();

    const subsectionRelation = subsection
        ? `
            subsections!inner (
                slug
            )
        `
        : `
            subsections (
                slug
            )
        `;

    let query = supabase
        .from('article_sections')
        .select(`
            articles!inner (
                id,
                title,
                title_en,
                category,
                subcategory,
                part
            ),

            sections!inner (
                slug
            ),

            ${subsectionRelation}
        `);

    if (section) {
        query = query.eq(
            'sections.slug',
            section
        );
    }

    if (subsection) {
        query = query.eq(
            'subsections.slug',
            subsection
        );
    }

    if (category) {
        query = query.eq(
            'articles.category',
            category
        );
    }

    if (subcategory) {
        query = query.eq(
            'articles.subcategory',
            subcategory
        );
    }

    const { data, error } = await query;

    if (error) {
        console.error(error);
        return [];
    }

    if (!data?.length) {
        return [];
    }

    const normalized: Article[] = data
        .map(item => {
            const article = Array.isArray(item.articles)
                ? item.articles[0]
                : item.articles;

            if (!article) {
                return null;
            }

            return {
                name: article.title,

                name_en: article.title_en,

                slug: article.id,

                category:
                    article.category as ArticleCategory,

                subcategory:
                    article.subcategory,

                part: article.part
                    ? Number(article.part)
                    : undefined,
            };
        })
        .filter(Boolean) as Article[];

    normalized.sort((a, b) => {
        if (!a.part) return 1;
        if (!b.part) return -1;

        return Number(a.part) - Number(b.part);
    });

    return normalized;
};
