import { cookies } from 'next/headers';
import { createT } from './core';

export async function getLocale() {
    const cookieStore = await cookies();
    return (cookieStore.get('locale')?.value as 'ru' | 'en') || 'ru';
}

export async function createServerT() {
    const locale = await getLocale();
    return createT(locale);
}
