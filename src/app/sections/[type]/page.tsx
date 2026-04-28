import { getArticlesBySectionSlug } from '@/lib/services/sections';
import ArticlesClient from '@/app/content/[type]/ArticlesClient';
import { getLocale } from '@/lib/i18n/server';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PageProps = {
    params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { type } = await params;
    return {
        title: `${type} | Гео-D7`,
    };
}

export default async function SectionPage({ params }: PageProps) {
    const { type } = await params;
    const locale = await getLocale();
    
    const articles = await getArticlesBySectionSlug(type);
    
    if (!articles.length) {
        notFound();
    }
    
    return <ArticlesClient initialArticles={articles} category={type} locale={locale} />;
}
