import { MetadataRoute } from 'next';
import { getArticlesByCategory } from '@/lib/services/articles';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://geo-d7.vercel.app';
    
    const staticPages = [
        { url: '', priority: 1.0, change: 'daily' },
        { url: '/content/coordinates', priority: 0.9, change: 'weekly' },
        { url: '/content/time', priority: 0.9, change: 'weekly' },
        { url: '/content/geodynamics', priority: 0.9, change: 'weekly' },
        { url: '/content/geodesy', priority: 0.9, change: 'weekly' },
        { url: '/content/navigation', priority: 0.9, change: 'weekly' },
        { url: '/content/positioning', priority: 0.9, change: 'weekly' },
        { url: '/content/synchronization', priority: 0.9, change: 'weekly' },
        { url: '/content/miscellaneous', priority: 0.9, change: 'weekly' },
        { url: '/content/articles/vestnik', priority: 0.8, change: 'weekly' },
        { url: '/content/articles/other', priority: 0.8, change: 'weekly' },
        { url: '/dictionary', priority: 0.8, change: 'weekly' },
        { url: '/about', priority: 0.6, change: 'monthly' },
        { url: '/partners', priority: 0.6, change: 'monthly' },
        { url: '/links', priority: 0.5, change: 'monthly' },
        { url: '/shop', priority: 0.5, change: 'monthly' },
    ];
    
    // Динамические страницы (все статьи)
    let dynamicPages: MetadataRoute.Sitemap = [];
    
    try {
        const categories = ['coordinates', 'time', 'geodynamics', 'geodesy', 'navigation', 'positioning', 'synchronization', 'miscellaneous'];
        
        for (const category of categories) {
            const articles = await getArticlesByCategory({ category });
            if (articles) {
                dynamicPages.push(...articles.map(article => ({
                    url: `${baseUrl}/content/${category}/${article.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                })));
            }
        }
    } catch (error) {
        console.error('Error fetching articles for sitemap:', error);
    }
    
    return [
        ...staticPages.map(page => ({
            url: `${baseUrl}${page.url}`,
            lastModified: new Date(),
            changeFrequency: page.change as 'daily' | 'weekly' | 'monthly',
            priority: page.priority,
        })),
        ...dynamicPages,
    ];
}
