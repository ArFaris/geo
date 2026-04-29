'use server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function incrementArticleViewsAction(articleId: string) {
    const cookieStore = await cookies();
    const viewedKey = `viewed_${articleId}`;

    if (cookieStore.get(viewedKey)) {
        return;
    }

    const supabase = await createClient();
    const { error } = await supabase.rpc('increment_views', {
        article_id: articleId,
    });

    if (error) {
        console.error('Ошибка обновления просмотров:', error);
        return;
    }

    cookieStore.set(viewedKey, 'true', {
        maxAge: 60 * 60 * 24,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
}
