import { getArticlesByCategory } from '@/lib/services/articles';
import ArticlesClient from '../../[type]/ArticlesClient';
import { createServerT, getLocale } from '@/lib/i18n/server';
import { Metadata } from 'next';

type PageProps = {
    params: Promise<{ subcategory: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { subcategory } = await params;
    const t = await createServerT();
    
    const subcategoryName = t(`subtitles.${subcategory}`);
    const categoryName = t(`title.articles`);
    
    let description = '';
    let keywords = '';
    
    if (subcategory === 'vestnik') {
        description = `Научный вестник по геодезии, навигации и GNSS. Статьи, исследования, обзоры и аналитика от экспертов Гео-D7.`;
        keywords = `геодезический вестник, научный вестник, геодезия, GNSS, навигация, статьи`;
    } else if (subcategory === 'other') {
        description = `Статьи по геодезии, навигации и GNSS. Различные темы: позиционирование, синхронизация, геодинамика.`;
        keywords = `геодезия, навигация, GNSS, позиционирование, синхронизация, геодинамика, статьи`;
    } else {
        description = `Статьи по теме "${subcategoryName}" в области геодезии, навигации и GNSS технологий.`;
        keywords = `${subcategoryName}, геодезия, навигация, GNSS, статьи`;
    }
    
    return {
        title: `${subcategoryName} | ${categoryName} | Гео-D7`,
        description,
        keywords,
        
        openGraph: {
            title: `${subcategoryName} | Гео-D7`,
            description,
            url: `https://geo-d7.vercel.app/content/articles/${subcategory}`,
            siteName: 'Гео-D7',
            type: 'website',
            locale: 'ru_RU',
        },
        
        twitter: {
            card: 'summary',
            title: `${subcategoryName} | Гео-D7`,
            description: description.substring(0, 200),
        },
        
        alternates: {
            canonical: `https://geo-d7.vercel.app/content/articles/${subcategory}`,
        },
        
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function ArticlesPage({ params }: PageProps) {
    const { subcategory } = await params;
    const locale = await getLocale();
    
    const initialArticles = await getArticlesByCategory({ category: 'articles', subcategory: subcategory });
    
    return <ArticlesClient initialArticles={initialArticles} category={'articles'} subcategory={subcategory} locale={locale} />;
}
