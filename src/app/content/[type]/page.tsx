import { getArticlesByCategory } from '@/lib/services/articles';
import ArticlesClient from './ArticlesClient';
import { createServerT, getLocale } from '@/lib/i18n/server';
import { Metadata } from 'next';

type PageProps = {
    params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { type } = await params;
    const t = await createServerT();
    
    const categoryName = t(`title.${type}`);
    
    return {
        title: `${categoryName} | Гео-D7`,
        description: `Статьи по теме "${categoryName}" в области геодезии, навигации и GNSS технологий. Актуальные исследования, обзоры и аналитика.`,
        keywords: [categoryName, 'геодезия', 'навигация', 'GNSS', 'статьи'].join(', '),
        openGraph: {
            title: `${categoryName} | Гео-D7`,
            description: `Статьи по теме "${categoryName}"`,
            type: 'website',
        },
    };
}

export default async function ArticlesPage({ params }: PageProps) {
    const { type } = await params;
    const locale = await getLocale();
    
    const initialArticles = await getArticlesByCategory({ category: type });
    
    return <ArticlesClient initialArticles={initialArticles} category={type} locale={locale} />;
}
