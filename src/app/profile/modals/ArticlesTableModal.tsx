'use client';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import ArticlesTable from '../components/ArticlesTable';
import Text from '@/components/ui/Text';
import s from './modal.module.scss';

type ArticlesTableModalProps = {
    onClose: () => void;
    locale: 'ru' | 'en';
    user: User;
};

export default function ArticlesTableModal({ onClose, locale, user }: ArticlesTableModalProps) {
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

    return (
        <div className={s.overlay} onClick={onClose}>
            <div className={`${s.large} ${s.modalTable}`} onClick={e => e.stopPropagation()}>
                <div className={s.header}>
                    <Text view="title-small" weight="bold">
                        {t('Редактирование статей', 'Edit articles')}
                    </Text>
                    <button className={s.close} onClick={onClose}>✕</button>
                </div>
                <div className={s.content}>
                    <ArticlesTable 
                        locale={locale} 
                        refreshTrigger={refreshTrigger} 
                        onRefresh={handleRefresh}
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
}