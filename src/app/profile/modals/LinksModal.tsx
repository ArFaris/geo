'use client';
import { useEffect, useState } from 'react';
import LinksTable from '../components/LinksTable/LinksTable';
import Text from '@/components/ui/Text';
import s from './modal.module.scss';

type LinksModalProps = {
    title: 'sources' | 'partners';
    onClose: () => void;
    locale: 'ru' | 'en';
};

export default function LinksModal({ title, onClose, locale }: LinksModalProps) {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const t = (ru: string, en: string) => locale === 'ru' ? ru : en;
    const modalTitle = title === 'sources' 
        ? t('Полезные ссылки', 'Sources')
        : t('Информационные партнеры', 'Partners');

    return (
        <div className={s.overlay} onClick={onClose}>
            <div className={`${s.modalTable} ${s.large}`} onClick={e => e.stopPropagation()}>
                <div className={s.header}>
                    <Text view="title-small" weight="bold">
                        {modalTitle}
                    </Text>
                    <button className={s.close} onClick={onClose}>✕</button>
                </div>
                <div className={s.content}>
                    <LinksTable 
                        title={title}
                        locale={locale} 
                        refreshTrigger={refreshTrigger} 
                        onRefresh={handleRefresh}
                    />
                </div>
            </div>
        </div>
    );
}