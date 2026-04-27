import type { Metadata } from 'next';

export const SITE_CONFIG: Metadata = {
    title: {
        absolute: 'Гео-D7 | Геодезия, GNSS, спутниковая навигация и геодинамика',
    },
    description: 'Научно-технический портал по геодезии, геодинамике, спутниковой навигации GNSS/GPS/ГЛОНАСС, позиционированию и синхронизации. Статьи, обзоры, аналитика экспертов.',
    
    keywords: [
        'геодезия', 'геодинамика', 'GNSS', 'GPS', 'ГЛОНАСС', 'спутниковая навигация',
        'позиционирование', 'синхронизация', 'EPN', 'EUREF', 'ITRS', 'ITRF',
        'WGS-84', 'ПЗ-90', 'СК-95', 'координатные системы', 'геодезические сети',
        'высокоточное позиционирование', 'RTK', 'PPK', 'мониторинг деформаций',
        'геодезические измерения', 'маркшейдерия', 'геоинформатика'
    ].join(', '),

    authors: [
        { name: 'Редакция Гео-D7', url: 'https://geo-d7.vercel.app/about' }
    ],
    creator: 'Гео-D7',
    publisher: 'Гео-D7',
    generator: 'Next.js',
    
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-snippet': 320,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
        nocache: false,
    },
    
    openGraph: {
        title: 'Гео-D7 | Геодезия, GNSS и геодинамика',
        description: 'Научно-технический портал по геодезии, геодинамике, спутниковой навигации GNSS/GPS/ГЛОНАСС, позиционированию и синхронизации.',
        url: 'https://geo-d7.vercel.app',
        siteName: 'Гео-D7',
        locale: 'ru_RU',
        type: 'website',
        countryName: 'Russia',
    },
    
    alternates: {
        canonical: 'https://geo-d7.vercel.app',
    },
    
    verification: {
        google: 'google-site-verification=ваш_код',
        yandex: 'yandex-verification=ваш_код',
    },
    
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
    themeColor: '#0a3e6d',
    colorScheme: 'light dark',
    referrer: 'origin-when-cross-origin',
    formatDetection: {
        email: true,
        address: true,
        telephone: true,
    },
    
    category: 'science/technology',
    classification: 'Научно-технический портал',
    
    other: {
        'geo.region': 'RU',
        'geo.placename': 'Moscow',
        'geo.position': '55.7558;37.6176',
        'ICBM': '55.7558, 37.6176',
        'telegram:channel': 'https://t.me/geod7',
        'maks:profile': 'https://maks.ru/geod7',
        'profile:username': 'geod7',
    },
};
