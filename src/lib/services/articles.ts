import { createClient as createServerClient } from '@/lib/supabase/server';
import type { Article, Articles } from '@/types/articles';

export const getArticlesByCategory = async ({
  category,
  subcategory
}: {
  category: string;
  subcategory?: string;
}): Promise<Articles[]> => {
  const supabase = await createServerClient();

  let query = supabase
    .from('articles')
    .select('id, title, title_en, part')
    .eq('category', category)
    .order('part', { ascending: true });

  if (subcategory) {
    query = query.eq('subcategory', subcategory);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching articles:', error);
    throw new Error(error.message);
  }

  return (data || []).map((item) => ({
    name: item.title,
    name_en: item.title_en,
    slug: item.id,
    part: item.part || undefined,
  }));
};

export const getArticle = async (id: string): Promise<Article | null> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  if (!data) return null;

  return {
    name: data.title,
    name_en: data.title_en,
    slug: data.id,
    part: data.part || undefined,
    createdAt: data.created_at,
    readingTime: data.reading_time,
    views: data.views,
    likes: data.likes,
    category: data.category,
    subcategory: data.subcategory,
    pdfPath: data.pdf_path || null,
  };
};

import { cookies } from 'next/headers';

export const incrementArticleViews = async (id: string) => {
    const cookieStore = await cookies();
    const viewedKey = `viewed_${id}`;
    
    if (cookieStore.get(viewedKey)) {
        return;
    }
    
    const supabase = await createServerClient();
    
    const { error } = await supabase.rpc('increment_views', {
        article_id: id
    });
    
    if (!error) {
        cookieStore.set(viewedKey, '1', {
            maxAge: 60 * 60 * 24,
            path: '/',
            httpOnly: true,
        });
    }
    
    if (error) {
        console.error('Failed to increment views:', error);
    }
};
