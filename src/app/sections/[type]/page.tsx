import Link from 'next/link';
import Text from '@/components/ui/Text';
import '@/styles/global.scss';
import { createServerT, getLocale } from '@/lib/i18n/server';
import { Metadata } from 'next';
import Title from '@/components/shared/Title';
import EarthIcon from '@/components/ui/icons/EarthHoriz';

type PageProps = {
    params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { type } = await params;
    return {
        title: `${type} | Гео-D7`,
    };
}

export default async function SectionLinks({ params }: PageProps) {
    const { type } = await params;
    const t = await createServerT();
    const locale = await getLocale();
    const subsection = type === 'navigation' ? 'sea' : type === 'positioning' ? 'relative' : 'all';

    return (
        <>
            <Title locale={locale} title={type} />
            <div className={'earth__wrapper'}><EarthIcon className={'earth'}/></div>
            
            <div className={'links'}>
                <Link href={`/sections/${type}/news/all${'/' + subsection || ''}`} className={'link'}>
                    <Text color="secondary" view="subtitle">{t('nav.news')}</Text>
                </Link>
                <Link href={`/sections/${type}/reviews/all${'/' + subsection || ''}`} className={'link'}>
                    <Text color="secondary" view="subtitle">{t('nav.reviews')}</Text>
                </Link>
                <Link href={`/sections/${type}/analytics/all${'/' + subsection || ''}`} className={'link'}>
                    <Text color="secondary" view="subtitle">{t('nav.analytics')}</Text>
                </Link>
                <Link href={`/sections/${type}/articles/vestnik${'/' + subsection || ''}`} className={'link'}>
                    <Text color="secondary" view="subtitle">{t('nav.articles')}</Text>
                </Link>
            </div>
        </>
    );
}
