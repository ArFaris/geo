'use client';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import Text from '@/components/ui/Text';
import s from './page.module.scss';
import dynamic from 'next/dynamic';
import ArticlesTableModal from './modals/ArticlesTableModal';
import cn from 'classnames';

const StatisticsModal = dynamic(() => import('./modals/StatisticsModal'), { ssr: false });
const ArticleFormModal = dynamic(() => import('./modals/ArticleFormModal'), { ssr: false });
const RegisteredUsersModal = dynamic(() => import('./modals/RegisteredUsersModal'), { ssr: false });
const LinksModal = dynamic(() => import('./modals/LinksModal'), { ssr: false });

type AdminPanelProps = {
    user: User;
    locale: 'ru' | 'en';
};

export default function AdminPanel({ user, locale }: AdminPanelProps) {
    const [showStats, setShowStats] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showArticles, setShowArticles] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showSources, setShowSources] = useState(false);
    const [showPartners, setShowPartners] = useState(false);

    return (
        <section className={s.admin__panel}>
                <article onClick={() => setShowStats(true)} className={cn('article', 'link', s.admin__article)}>
                    <Text color='secondary'>
                        {locale === 'ru' ? 'Посмотреть статистику' : 'View statistics'}
                    </Text>
                </article>

                <article onClick={() => setShowCreateForm(true)} className={cn('article', 'link', s.admin__article)}>
                    <Text color='secondary'>
                        {locale === 'ru' ? 'Создать новую статью' : 'Create a new article'}
                    </Text>
                </article>

                <article onClick={() => setShowArticles(true)} className={cn('article', 'link', s.admin__article)}>
                    <Text color='secondary'>
                        {locale === 'ru' ? 'Редактировать статьи' : 'Edit articles'}
                    </Text>
                </article>

                <article onClick={() => setShowUsers(true)} className={cn('article', 'link', s.admin__article)}>
                    <Text color='secondary'>
                        {locale === 'ru' ? 'Пользователи' : 'Users'}
                    </Text>
                </article>

                <article onClick={() => setShowSources(true)} className={cn('article', 'link', s.admin__article)}>
                    <Text color='secondary'>
                        {locale === 'ru' ? 'Полезные ссылки' : 'Sources'}
                    </Text>
                </article>

                <article onClick={() => setShowPartners(true)} className={cn('article', 'link', s.admin__article)}>
                    <Text color='secondary'>
                        {locale === 'ru' ? 'Партнеры' : 'Partners'}
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

            {showUsers && (
                <RegisteredUsersModal
                    onClose={() => setShowUsers(false)} 
                    locale={locale}
                />
            )}

            {showSources && (
                <LinksModal
                    title="sources"
                    onClose={() => setShowSources(false)} 
                    locale={locale}
                />
            )}

            {showPartners && (
                <LinksModal
                    title="partners"
                    onClose={() => setShowPartners(false)} 
                    locale={locale}
                />
            )}
        </section>
    );
}