import { createServerT, getLocale } from '@/lib/i18n/server';
import EarthIcon from '@/components/ui/icons/EarthHoriz';
import Title from '@/components/shared/Title';
import Text from '@/components/ui/Text';
import Link from 'next/link';
import s from './page.module.scss';
import { SITE_CONFIG } from './metadata/home.metadata';
import '@/styles/global.scss';

export const metadata = SITE_CONFIG;

const types = ["coordinates", "time", "geodynamics", "geodesy", "navigation", "positioning", "synchronization", "miscellaneous"]

const HomePage = async () => {
    const t = await createServerT();
    const locale = await getLocale();

    return (
        <section>
            <div className={s.earth__wrapper}><EarthIcon className={s.earth}/></div>

            <Title title={'home'} className={s.home} locale={locale} />

            <div className={s.types}>
                {
                    types.map(type => (
                        <div key={type} className={s.type}>
                            <Link href={`/content/${type}`} className={'borderEffect'}>
                              <Text weight="medium">{t(`title.${type}`)}</Text>
                            </Link>
                        </div>
                    )
                )
                }
            </div>
            
            <div className={s.links}>
                <Link href="/content/news" className={s.link}>
                    <Text color="secondary" view="subtitle">{t('nav.news')}</Text>
                </Link>
                <Link href="/content/reviews" className={s.link}>
                    <Text color="secondary" view="subtitle">{t('nav.reviews')}</Text>
                </Link>
                <Link href="/content/analytics" className={s.link}>
                    <Text color="secondary" view="subtitle">{t('nav.analytics')}</Text>
                </Link>
                <Link href="/content/articles/vestnik" className={s.link}>
                    <Text color="secondary" view="subtitle">{t('nav.articles')}</Text>
                </Link>
                <Link href="/dictionary" className={s.link}>
                    <Text color="secondary" view="subtitle">{t('nav.dict')}</Text>
                </Link>
            </div>
        </section>
    );
}

export default HomePage;
