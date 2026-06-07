'use client';
import { useEffect, useState } from 'react';
import { getStatistics } from '@/app/actions/articles';
import Text from '@/components/ui/Text';
import s from './modal.module.scss';

type StatisticsModalProps = {
    onClose: () => void;
    locale: 'ru' | 'en';
};

type StatItem = {
    id: string;
    title: string;
    views: number;
};

export default function StatisticsModal({ onClose, locale }: StatisticsModalProps) {
    const [stats, setStats] = useState<StatItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStatistics().then(data => {
            setStats(data);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Блокируем скролл тела при открытии модалки
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const t = (ru: string, en: string) => locale === 'ru' ? ru : en;

    if (loading) {
        return (
            <div className={s.overlay} onClick={onClose}>
                <div className={s.modal} onClick={e => e.stopPropagation()}>
                    <div className={s.content}>{t('Загрузка...', 'Loading...')}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={s.overlay} onClick={onClose}>
            <div className={s.modal} onClick={e => e.stopPropagation()}>
                <div className={s.header}>
                    <Text view="title-small" weight="bold">
                        {t('Статистика статей', 'Articles statistics')}
                    </Text>
                    <button className={s.close} onClick={onClose}>✕</button>
                </div>
                <div className={s.content}>
                    {stats.length === 0 ? (
                        <div className={s.empty}>{t('Нет статей', 'No articles')}</div>
                    ) : (
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>{t('Статья', 'Article')}</th>
                                    <th>{t('Просмотры', 'Views')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.map(stat => (
                                    <tr key={stat.id}>
                                        <td>{stat.title}</td>
                                        <td>{stat.views ?? 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}