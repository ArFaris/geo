'use server';
import { cookies } from 'next/headers';

export async function setLanguage(locale: 'ru' | 'en') {
    const cookieStore = await cookies();
    cookieStore.set('locale', locale);
    
    return { success: true };
}
