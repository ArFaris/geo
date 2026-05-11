// app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { getArticlesByCategory } from '@/lib/services/articles';

// КЛЮЧЕВАЯ СТРОКА — убираем ошибку с cookies
export const dynamic = 'force-dynamic';

export async function GET() {
    const baseUrl = 'https://geo-d7.vercel.app';
    
    const staticPages = [
        { url: '', priority: 1.0, change: 'daily' },
        { url: '/sections/coordinates', priority: 0.9, change: 'weekly' },
        { url: '/sections/time', priority: 0.9, change: 'weekly' },
        { url: '/sections/geodynamics', priority: 0.9, change: 'weekly' },
        { url: '/sections/geodesy', priority: 0.9, change: 'weekly' },
        { url: '/sections/navigation', priority: 0.9, change: 'weekly' },
        { url: '/sections/positioning', priority: 0.9, change: 'weekly' },
        { url: '/sections/synchronization', priority: 0.9, change: 'weekly' },
        { url: '/sections/miscellaneous', priority: 0.9, change: 'weekly' },
        { url: '/articles/vestnik', priority: 0.8, change: 'weekly' },
        { url: '/articles/other', priority: 0.8, change: 'weekly' },
        { url: '/dictionary', priority: 0.8, change: 'weekly' },
        { url: '/about', priority: 0.6, change: 'monthly' },
        { url: '/partners', priority: 0.6, change: 'monthly' },
        { url: '/links', priority: 0.5, change: 'monthly' },
        { url: '/shop', priority: 0.5, change: 'monthly' },
    ];
    
    let dynamicPages: { url: string; priority: number; change: string }[] = [];
    
    try {
        const categories = ['coordinates', 'time', 'geodynamics', 'geodesy', 'navigation', 'positioning', 'synchronization', 'miscellaneous'];
        
        for (const category of categories) {
            const articles = await getArticlesByCategory({ category });
            if (articles && Array.isArray(articles)) {
                dynamicPages.push(...articles.map(article => ({
                    url: `${baseUrl}/content/${category}/${article.slug}`,
                    priority: 0.7,
                    change: 'monthly',
                })));
            }
        }
    } catch (error) {
        console.error('Error fetching articles for sitemap:', error);
    }
    
    // Формируем XML вручную (сохраняем все преимущества)
    const allUrls = [
        ...staticPages.map(page => ({
            url: `${baseUrl}${page.url}`,
            priority: page.priority,
            change: page.change,
        })),
        ...dynamicPages,
    ];
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(item => `  <url>
    <loc>${escapeXml(item.url)}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${item.change}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}

function escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}