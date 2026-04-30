import { createClient } from '@/lib/supabase/server';
import type { Articles } from '@/types/articles';

export const getArticlesBySectionSlug = async (slug: string): Promise<Articles[]> => {
    const supabase = await createClient();

    const { data: section, error: sectionError } = await supabase
        .from('sections')
        .select('id')
        .eq('slug', slug)
        .single()

    if (sectionError) {
        console.error(sectionError)
    }
    
    if (sectionError || !section) {
        return [];
    }

    const { data: articleLinks, error: linksError } = await supabase
        .from('article_sections')
        .select('article_id')
        .eq('section_id', section.id);
    
    if (linksError || !articleLinks?.length) {
        return [];
    }
    
    const articleIds = articleLinks.map(link => link.article_id);
    
    const { data: articles, error: articlesError } = await supabase
        .from('articles')
        .select('id, title, title_en, category, part')
        .in('id', articleIds)
        .order('part', { ascending: true, nullsFirst: false });

    if (articlesError) {
        return [];
    }
    
    return (articles || []).map((item) => ({
        name: item.title,
        name_en: item.title_en,
        slug: item.id,
        category: item.category,
        part: item.part || undefined,
    }));
};
