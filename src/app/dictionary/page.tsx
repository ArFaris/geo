import { Metadata } from 'next';
import { getLocale } from '@/lib/i18n/server';
import DictionaryClient from './DictionaryClient';

export const metadata: Metadata = {
    title: 'Словарь терминов | Гео-D7',
    description: 'Словарь геодезических и навигационных терминов. Определения, пояснения, источники.',
};

export default async function DictionaryPage() {
    const locale = await getLocale();
    
    return <DictionaryClient locale={locale} />;
}
