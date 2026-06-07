'use client';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import Text from '@/components/ui/Text';
import s from './page.module.scss';
import dynamic from 'next/dynamic';
import ArticlesTableModal from './modals/ArticlesTableModal';

const StatisticsModal = dynamic(() => import('./modals/StatisticsModal'), { ssr: false });
const ArticleFormModal = dynamic(() => import('./modals/ArticleFormModal'), { ssr: false });

type AdminPanelProps = {
    user: User;
    locale: 'ru' | 'en';
};

export default function AdminPanel({ user, locale }: AdminPanelProps) {
    const [showStats, setShowStats] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showArticles, setShowArticles] = useState(false);

    return (
        <section className={s.admin__panel}>
            <article onClick={() => setShowStats(true)} className={'article'}>
                <Text color='primary'>
                    {locale === 'ru' ? 'Посмотреть статистику' : 'View statistics'}
                </Text>
            </article>

            <article onClick={() => setShowCreateForm(true)} className={'article'}>
                <Text color='primary'>
                    {locale === 'ru' ? 'Создать новую статью' : 'Create a new article'}
                </Text>
            </article>

            <article onClick={() => setShowArticles(true)} className={'article'}>
                <Text color='primary'>
                    {locale === 'ru' ? 'Редактировать статьи' : 'Edit articles'}
                </Text>
            </article>

            {showStats && (
                <StatisticsModal 
                    onClose={() => setShowStats(false)} 
                    locale={locale} 
                />
            )}

            {showCreateForm && (
                <ArticleFormModal
                    mode="create"
                    onClose={() => setShowCreateForm(false)} 
                    locale={locale}
                />
            )}

            {showArticles && (
                <ArticlesTableModal
                    onClose={() => setShowArticles(false)} 
                    locale={locale} 
                    user={user}
                />
            )}
        </section>
    );
}