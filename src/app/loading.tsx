import LoadingScreen from '@/components/ui/LoadingScreen';
import { getLocale } from '@/lib/i18n/server';

export default async function Loading() {
    const locale = await getLocale();

    return <LoadingScreen locale={locale} />;
}
