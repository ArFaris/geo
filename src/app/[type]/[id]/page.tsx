import { Metadata } from 'next';
import { getArticle } from '@/lib/services/articles';
import { createServerT, getLocale } from '@/lib/i18n/server';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/server';

type PageProps = {
    params: Promise<{ type: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const article = await getArticle(id);
    const t = await createServerT();
    
    if (!article) {
        return {
            title: 'Статья не найдена | Гео-D7',
            robots: { index: false },
        };
    }
    
    const categoryName = t(`title.${article.category}`);
    
    return {
        title: `${article.name} | Гео-D7`,
        description: `${article.name_en || article.name.substring(0, 160)}. ${categoryName}. Геодезия, спутниковая навигация GNSS, высокоточное позиционирование.`,
        keywords: `${article.category}, геодезия, навигация, GNSS, позиционирование, синхронизация, геодинамика, координатные системы`,
        authors: [{ name: 'Эксперт Гео-D7' }],
        openGraph: {
            title: article.name,
            description: article.name_en || article.name.substring(0, 200),
            url: `https://geo-d7.vercel.app/content/${article.category}/${article.slug}`,
            siteName: 'Гео-D7',
            type: 'article',
            publishedTime: article.createdAt,
            authors: [categoryName],
            tags: [article.category, 'геодезия', 'GNSS'],
        },
        twitter: {
            card: 'summary',
            title: article.name,
            description: (article.name_en || article.name).substring(0, 200),
        },
        alternates: { canonical: `https://geo-d7.vercel.app/content/${article.category}/${article.slug}` },
        robots: { index: true, follow: true },
    };
}

export default async function ArticlePage({ params }: PageProps) {
    const { id } = await params;
    const locale = await getLocale();
    
    const article = await getArticle(id);
    const user = await getCurrentUser();
    
    if (!article) {
        notFound();
    }
    
    return (
        <ArticleClient 
            article={article} 
            pdfPath={article.pdfPath}
            locale={locale} 
            user={user}
        />
    );
}
