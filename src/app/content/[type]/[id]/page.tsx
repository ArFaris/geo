import { Metadata } from 'next';
import { getArticle } from '@/lib/services/articles';
import { getPdfUrl } from '@/lib/services/pdf';
import { createServerT, getLocale } from '@/lib/i18n/server';
import ArticleClient from './ArticleClient';
import { notFound } from 'next/navigation';

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
    const readingTimeText = `${article.readingTime} минут чтения`;
    
    return {
        title: `${article.name} | Гео-D7`,
        description: `${article.name_en || article.name.substring(0, 160)}. ${categoryName}. ${readingTimeText}. Геодезия, спутниковая навигация GNSS, высокоточное позиционирование.`,
        keywords: `${article.category}, ${article.subcategory}, геодезия, навигация, GNSS, позиционирование, синхронизация, геодинамика, координатные системы`,
        authors: [{ name: 'Эксперт Гео-D7' }],
        openGraph: {
            title: article.name,
            description: article.name_en || article.name.substring(0, 200),
            url: `https://geo-d7.vercel.app/content/${article.category}/${article.slug}`,
            siteName: 'Гео-D7',
            type: 'article',
            publishedTime: article.createdAt,
            authors: [categoryName],
            tags: [article.category, article.subcategory, 'геодезия', 'GNSS'],
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
    
    if (!article) {
        notFound();
    }
    
    let pdfUrl: string | null = null;
    if (article.pdfPath) {
        pdfUrl = await getPdfUrl(article.pdfPath);
    }
    
    return (
        <ArticleClient 
            article={article} 
            pdfUrl={pdfUrl} 
            locale={locale} 
        />
    );
}
