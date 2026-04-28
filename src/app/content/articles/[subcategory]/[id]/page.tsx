import { Metadata } from 'next';
import { getArticle } from '@/lib/services/articles';
import { getPdfUrl } from '@/lib/services/pdf';
import { getLocale } from '@/lib/i18n/server';
import { notFound } from 'next/navigation';
import ArticleClient from '../../../[type]/[id]/ArticleClient';

type PageProps = {
    params: Promise<{ subcategory: string; id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        return { title: 'Статья не найдена | Гео-D7' };
    }
    
    return {
        title: `${article.name} | Гео-D7`,
        description: article.name_en || article.name.substring(0, 160),
        openGraph: {
            title: article.name,
            description: article.name_en || article.name.substring(0, 160),
            type: 'article',
            publishedTime: article.createdAt,
        },
    };
}

export default async function ArticleWithSubcategoryPage({ params }: PageProps) {
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
