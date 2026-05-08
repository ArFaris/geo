import Link from 'next/link';
import Text from '@/components/ui/Text';
import '@/styles/global.scss';
import { createServerT } from '@/lib/i18n/server';

export default async function SectionLinks() {
    const t = await createServerT();

    return (
        <div className={'links'}>
            <Link href="/sections/news" className={'link'}>
                <Text color="secondary" view="subtitle">{t('nav.news')}</Text>
            </Link>
            <Link href="/sections/reviews" className={'link'}>
                <Text color="secondary" view="subtitle">{t('nav.reviews')}</Text>
            </Link>
            <Link href="/sections/analytics" className={'link'}>
                <Text color="secondary" view="subtitle">{t('nav.analytics')}</Text>
            </Link>
            <Link href="/sections/articles/vestnik" className={'link'}>
                <Text color="secondary" view="subtitle">{t('nav.articles')}</Text>
            </Link>
        </div>
    );
}
