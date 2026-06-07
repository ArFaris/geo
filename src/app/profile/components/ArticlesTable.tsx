'use client';
import { useState, useEffect } from 'react';
import { getArticles, deleteArticle } from '@/app/actions/articles';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import dynamic from 'next/dynamic';
import { ArticleForTable } from '@/types/articles';
import s from './articlesTable.module.scss';
import cn from 'classnames';

const ArticleFormModal = dynamic(() => import('../modals/ArticleFormModal'), { ssr: false });

type ArticlesTableProps = {
    locale: 'ru' | 'en';
    refreshTrigger: number;
    onRefresh: () => void;
    onClose: () => void;
};

const convertToArticleForTable = (item: any): ArticleForTable => ({
    id: item.id,
    name: item.title,
    name_en: item.title_en || '',
    part: item.part || null,
    readingTime: item.reading_time || null,
    views: item.views || 0,
    category: item.category,
    subcategory: item.subcategory || null,
});

const CATEGORIES = [
    { value: 'articles', labelRu: 'Статьи', labelEn: 'Articles' },
    { value: 'analytics', labelRu: 'Аналитика', labelEn: 'Analytics' },
    { value: 'reviews', labelRu: 'Обзоры', labelEn: 'Reviews' },
    { value: 'news', labelRu: 'Новости', labelEn: 'News' },
];

export default function ArticlesTable({ locale, refreshTrigger, onRefresh, onClose }: ArticlesTableProps) {
    const [articles, setArticles] = useState<ArticleForTable[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingArticle, setEditingArticle] = useState<ArticleForTable | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ articleId: string } | null>(null);

    useEffect(() => {
        loadArticles();
    }, [refreshTrigger]);

    const loadArticles = async () => {
        setLoading(true);
        const data = await getArticles(1, 100);
        const converted = data.map(convertToArticleForTable);
        setArticles(converted);
        setLoading(false);
    };

    const handleDeleteClick = (articleId: string) => {
        setConfirmModal({ articleId });
    };

    const confirmDelete = async () => {
        if (!confirmModal) return;
        await deleteArticle(confirmModal.articleId);
        setConfirmModal(null);
        onRefresh();  // ← перезагрузка только после реального удаления
        await loadArticles();
    };

    const handleEditClose = (changed: boolean = false) => {
        setEditingArticle(null);
        if (changed) {
            onRefresh();  // ← перезагрузка только если были изменения
            loadArticles();
        }
    };

    const getLocalizedText = (ru: string, en: string) => locale === 'ru' ? ru : en;

    const getCategoryLabel = (category: string) => {
        const cat = CATEGORIES.find(c => c.value === category);
        return cat ? getLocalizedText(cat.labelRu, cat.labelEn) : category;
    };

    const getSubcategoryLabel = (category: string, subcategory: string | null) => {
        if (category !== 'articles') return '—';
        if (subcategory === 'vestnik') return getLocalizedText('Вестник', 'Vestnik');
        if (subcategory === 'other') return getLocalizedText('Другие статьи', 'Other');
        return '—';
    };

    if (loading) {
        return <div className={s.loading}>{getLocalizedText('Загрузка...', 'Loading...')}</div>;
    }

    return (
        <>
            <div className={s.tableWrapper}>
                <table className={s.table}>
                    <thead>
                        <tr>
                            <th>{getLocalizedText('Название (рус)', 'Title (Ru)')}</th>
                            <th>{getLocalizedText('Название (англ)', 'Title (En)')}</th>
                            <th>{getLocalizedText('Категория', 'Category')}</th>
                            <th>{getLocalizedText('Подкатегория', 'Subcategory')}</th>
                            <th>{getLocalizedText('Часть', 'Part')}</th>
                            <th>{getLocalizedText('Время чтения', 'Reading time')}</th>
                            <th>{getLocalizedText('Просмотры', 'Views')}</th>
                            <th>{getLocalizedText('Действия', 'Actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article) => (
                            <tr key={article.id}>
                                <td>{article.name}</td>
                                <td>{article.name_en || '—'}</td>
                                <td>{getCategoryLabel(article.category)}</td>
                                <td>{getSubcategoryLabel(article.category, article.subcategory)}</td>
                                <td>{article.part || '—'}</td>
                                <td>{article.readingTime || '—'}</td>
                                <td>{article.views}</td>
                                <td className={s.btns}>
                                    <Button 
                                        className={cn(s.btn, s.btn__edit)} 
                                        view="light" 
                                        onClick={() => setEditingArticle(article)}
                                    >
                                        {getLocalizedText('Редактировать', 'Edit')}
                                    </Button>
                                    <Button 
                                        className={cn(s.btn, s.btn__delete)} 
                                        view="light" 
                                        onClick={() => handleDeleteClick(article.id)}
                                    >
                                        {getLocalizedText('Удалить', 'Delete')}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {confirmModal && (
                <div className={s.confirmOverlay} onClick={() => setConfirmModal(null)}>
                    <div className={s.confirmModal} onClick={e => e.stopPropagation()}>
                        <Text view="title-small" weight="bold">
                            {getLocalizedText('Удалить статью?', 'Delete article?')}
                        </Text>
                        <p className={s.confirmText}>
                            {getLocalizedText(
                                'Это действие нельзя отменить. Статья будет удалена навсегда.',
                                'This action cannot be undone. The article will be permanently deleted.'
                            )}
                        </p>
                        <div className={s.confirmButtons}>
                            <Button view="dark" onClick={confirmDelete}>
                                {getLocalizedText('Да', 'Yes')}
                            </Button>
                            <Button view="light" onClick={() => setConfirmModal(null)}>
                                {getLocalizedText('Отмена', 'Cancel')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {editingArticle && (
                <ArticleFormModal
                    mode="edit"
                    initialData={editingArticle}
                    onClose={(changed?: boolean) => handleEditClose(changed)}
                    locale={locale}
                />
            )}
        </>
    );
}