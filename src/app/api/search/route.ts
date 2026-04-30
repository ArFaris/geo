import { createClient } from '@/lib/supabase/server';
import { ArticleSearchResult } from '@/types/articles';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .rpc('search_articles', { search_term: query || null });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  const results = (data || []).map((item: ArticleSearchResult) => ({
    name: item.title,
    name_en: item.title_en,
    slug: item.id,
    part: item.part || undefined,
    category: item.category
  }));
  
  return NextResponse.json(results);
}
