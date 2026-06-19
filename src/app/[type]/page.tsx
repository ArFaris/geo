import { getArticlesByCategory } from '@/lib/services/articles';
import ArticlesClient from './ArticlesClient';
import { createServerT, getLocale } from '@/lib/i18n/server';
import { Metadata } from 'next';

type PageProps = {
    params: Promise<{ type: string, subtype: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { type } = await params;
    const t = await createServerT();
    
    const categoryNames: Record<string, { ru: string; en: string; description: string; keywords: string }> = {
        coordinates: {
            ru: 'Координатные системы',
            en: 'Coordinate Systems',
            description: 'Подробные статьи о геодезических координатных системах: WGS-84, ПЗ-90, СК-95, ITRS, ITRF, ETRS-89, EUREF. Теория и практика применения координатных систем в геодезии и навигации.',
            keywords: 'координатные системы, WGS-84, ПЗ-90, СК-95, ITRS, ITRF, ETRS-89, EUREF, геодезические координаты, системы координат',
        },
        time: {
            ru: 'Время в геодезии и навигации',
            en: 'Time in Geodesy and Navigation',
            description: 'Статьи о временных системах в геодезии и спутниковой навигации: UTC, TAI, GPS time, GLONASS time, синхронизация временных шкал, высокоточная синхронизация времени.',
            keywords: 'время в геодезии, временные системы, UTC, TAI, GPS время, ГЛОНАСС время, синхронизация времени, временные шкалы',
        },
        geodynamics: {
            ru: 'Геодинамика',
            en: 'Geodynamics',
            description: 'Научные статьи по геодинамике: движения земной коры, деформации, тектоника плит, GPS-мониторинг, сейсмология, современные методы изучения динамики Земли.',
            keywords: 'геодинамика, движения земной коры, деформации, тектоника плит, GPS-мониторинг, сейсмология, геодинамические процессы',
        },
        geodesy: {
            ru: 'Геодезия',
            en: 'Geodesy',
            description: 'Фундаментальные и прикладные статьи по геодезии: высшая геодезия, спутниковая геодезия, наземные измерения, геодезические сети, методы и приборы, современные технологии.',
            keywords: 'геодезия, высшая геодезия, спутниковая геодезия, геодезические сети, геодезические измерения, геодезические приборы, тахеометры, нивелиры',
        },
        navigation: {
            ru: 'Спутниковая навигация',
            en: 'Satellite Navigation',
            description: 'Современные технологии спутниковой навигации: GPS, ГЛОНАСС, Galileo, BeiDou. Принципы работы, методы позиционирования, точность, применение в различных отраслях.',
            keywords: 'спутниковая навигация, GPS, ГЛОНАСС, Galileo, BeiDou, глобальные навигационные системы, GNSS, навигационные технологии',
        },
        positioning: {
            ru: 'Высокоточное позиционирование',
            en: 'High-Precision Positioning',
            description: 'Методы высокоточного позиционирования: RTK, PPK, PPP. Субсантиметровая точность, дифференциальные поправки, EPN, CORS, применение в геодезии и промышленности.',
            keywords: 'высокоточное позиционирование, RTK, PPK, PPP, субсантиметровая точность, дифференциальные поправки, EPN, CORS сети',
        },
        synchronization: {
            ru: 'Синхронизация во времени',
            en: 'Time Synchronization',
            description: 'Методы высокоточной синхронизации времени: GNSS-синхронизация, временные серверы, PTP, NTP. Применение в телекоммуникациях, энергетике, финансах, транспорте.',
            keywords: 'синхронизация времени, GNSS-синхронизация, временные серверы, PTP, NTP, точное время, синхронизация по спутникам',
        },
        miscellaneous: {
            ru: 'Разное',
            en: 'Miscellaneous',
            description: 'Дополнительные материалы по геодезии, навигации и смежным наукам: аналитика, обзоры, новости, интервью с экспертами, обсуждения актуальных вопросов.',
            keywords: 'геодезия новости, навигация статьи, GNSS обзоры, геодинамика публикации, координатные системы аналитика',
        },
    };
    
    const info = categoryNames[type] || {
        ru: t(`title.${type}`),
        en: type,
        description: `Статьи по теме "${t(`title.${type}`)}" в области геодезии, спутниковой навигации GNSS, высокоточного позиционирования и синхронизации. Актуальные исследования, обзоры оборудования, аналитика рынка.`,
        keywords: `${t(`title.${type}`)}, геодезия, навигация, GNSS, позиционирование, синхронизация`,
    };
    
    return {
        title: `${info.ru} | Геодезический портал Гео-D7`,
        description: info.description,
        keywords: info.keywords,
        authors: [{ name: 'Редакция Гео-D7' }],
        openGraph: {
            title: `${info.ru} | Гео-D7`,
            description: info.description.substring(0, 200),
            url: `https://geo-d7.vercel.app/content/${type}`,
            siteName: 'Гео-D7',
            locale: 'ru_RU',
            type: 'website',
        },
        alternates: { canonical: `https://geo-d7.vercel.app/content/${type}` },
        robots: { index: true, follow: true },
    };
}

export default async function ArticlesPage({ params }: PageProps) {
    const { type } = await params;
    const locale = await getLocale();
    
    const initialArticles = await getArticlesByCategory({ category: type });
    
    return <ArticlesClient initialArticles={initialArticles} category={type} locale={locale} />;
}
