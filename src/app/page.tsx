import { createServerT, getLocale } from '@/lib/i18n/server';
import EarthIcon from '@/components/ui/icons/EarthHoriz';
import Title from '@/components/shared/Title';
import Text from '@/components/ui/Text';
import Link from 'next/link';
import s from './page.module.scss';
import { SITE_CONFIG } from './metadata/home.metadata';
import '@/styles/global.scss';

export const metadata = SITE_CONFIG;

const types = ["coordinates", "time", "geodynamics", "geodesy", "navigation", "positioning", "synchronization", "miscellaneous", "mathematical-processing"]

const HomePage = async () => {
    const t = await createServerT();
    const locale = await getLocale();

    return (
        <section>
            <div className={'earth__wrapper'}><EarthIcon className={'earth'}/></div>
            <Title title={'home'} className={s.home} locale={locale} />
            
            <div className={s.types}>
                {
                    types.map(type => (
                        <div key={type} className={s.type}>
                            <Link href={`/sections/${type}`} className={'borderEffect'}>
                              <Text weight="medium">{t(`title.${type}`)}</Text>
                            </Link>
                        </div>
                    )
                )
                }
            </div>
            
            <div className={'links'}>
                <Link href="/news/all" className={'link'}>
                    <Text color="secondary" view="subtitle">{t('nav.news')}</Text>
                </Link>
                <Link href="/reviews/all" className={'link'}>
                    <Text color="secondary" view="subtitle">{t('nav.reviews')}</Text>
                </Link>
                <Link href="/analytics/all" className={'link'}>
                    <Text color="secondary" view="subtitle">{t('nav.analytics')}</Text>
                </Link>
                <Link href="/articles/vestnik" className={'link'}>
                    <Text color="secondary" view="subtitle">{t('nav.articles')}</Text>
                </Link>
                <Link href="/dictionary" className={'link'}>
                    <Text color="secondary" view="subtitle">{t('nav.dict')}</Text>
                </Link>
            </div>
        </section>
    );
}

export default HomePage;
