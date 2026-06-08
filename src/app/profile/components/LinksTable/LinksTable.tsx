'use client';
import { useState, useEffect } from 'react';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import s from './linksTable.module.scss';
import cn from 'classnames';

type LinkItem = {
    id: string;
    name: string;
    name_en: string;
    link: string;
    description: string | null;
    description_en: string | null;
};

type LinksTableProps = {
    title: 'sources' | 'partners';
    locale: 'ru' | 'en';
    refreshTrigger: number;
    onRefresh: () => void;
};

export default function LinksTable({ title, locale, refreshTrigger, onRefresh }: LinksTableProps) {
    const [items, setItems] = useState<LinkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Partial<LinkItem>>({});
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    // Динамический импорт экшенов
    const [actions, setActions] = useState<any>(null);

    useEffect(() => {
        import('@/app/actions/links').then(mod => setActions(mod));
    }, []);

    useEffect(() => {
        if (actions) {
            loadItems();
        }
    }, [refreshTrigger, actions]);

    const loadItems = async () => {
        setLoading(true);
        const data = title === 'sources' 
            ? await actions.getSources() 
            : await actions.getPartners();
        setItems(data);
        setLoading(false);
    };

    const startAdd = () => {
        setIsAdding(true);
        setEditData({ name: '', name_en: '', link: '', description: '', description_en: '' });
    };

    const cancelAdd = () => {
        setIsAdding(false);
        setEditData({});
    };

    const startEdit = (item: LinkItem) => {
        setEditingId(item.id);
        setEditData(item);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleSave = async (id?: string) => {
        const formData = new FormData();
        formData.append('name', editData.name || '');
        formData.append('name_en', editData.name_en || '');
        formData.append('link', editData.link || '');
        formData.append('description', editData.description || '');
        formData.append('description_en', editData.description_en || '');

        if (id) {
            await actions[`update${title === 'sources' ? 'Source' : 'Partner'}`](id, formData);
            setEditingId(null);
        } else {
            await actions[`create${title === 'sources' ? 'Source' : 'Partner'}`](formData);
            setIsAdding(false);
        }
        setEditData({});
        onRefresh();
        await loadItems();
    };

    const handleDelete = async (id: string) => {
        await actions[`delete${title === 'sources' ? 'Source' : 'Partner'}`](id);
        setConfirmDelete(null);
        onRefresh();
        await loadItems();
    };

    const t = (ru: string, en: string) => locale === 'ru' ? ru : en;
    const isSources = title === 'sources';
    const pageTitle = isSources ? 'Полезные ссылки' : 'Информационные партнеры';

    if (loading) {
        return <div className={s.loading}>{t('Загрузка...', 'Loading...')}</div>;
    }

    return (
        <div className={s.container}>
            <div className={s.tableWrapper}>
                <table className={s.table}>
                    <thead>
                        <tr>
                            <th>{t('Название (рус)', 'Name (Ru)')}</th>
                            <th>{t('Название (англ)', 'Name (En)')}</th>
                            <th>URL</th>
                            <th>{t('Описание (рус)', 'Description (Ru)')}</th>
                            <th>{t('Описание (англ)', 'Description (En)')}</th>
                            <th>{t('Действия', 'Actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id}>
                                {editingId === item.id ? (
                                    <>
                                        <td><input value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className={s.input} /></td>
                                        <td><input value={editData.name_en || ''} onChange={(e) => setEditData({ ...editData, name_en: e.target.value })} className={s.input} /></td>
                                        <td><input value={editData.link || ''} onChange={(e) => setEditData({ ...editData, link: e.target.value })} className={s.input} /></td>
                                        <td><input value={editData.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className={s.input} /></td>
                                        <td><input value={editData.description_en || ''} onChange={(e) => setEditData({ ...editData, description_en: e.target.value })} className={s.input} /></td>
                                        <td className={s.btns}>
                                            <Button className={cn(s.btn, s.btn__edit)} view="light" onClick={() => handleSave(item.id)}>Сохранить</Button>
                                            <Button className={s.btn} view="light" onClick={cancelEdit}>Отменить</Button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{item.name}</td>
                                        <td>{item.name_en || '—'}</td>
                                        <td><a href={item.link} target="_blank" rel="noopener noreferrer" className={s.link}>{item.link}</a></td>
                                        <td>{item.description || '—'}</td>
                                        <td>{item.description_en || '—'}</td>
                                        <td className={s.btns}>
                                            <Button className={cn(s.btn, s.btn__edit)} view="light" onClick={() => startEdit(item)}>
                                                {t('Редактировать', 'Edit')}
                                            </Button>
                                            <Button className={cn(s.btn, s.btn__delete)} view="light" onClick={() => setConfirmDelete(item.id)}>
                                                {t('Удалить', 'Delete')}
                                            </Button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}

                        {/* Новая строка для добавления */}
                        {isAdding && (
                            <tr className={s.addRow}>
                                <td><input value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className={s.input} placeholder={t('Название (рус)', 'Name (Ru)')} /></td>
                                <td><input value={editData.name_en || ''} onChange={(e) => setEditData({ ...editData, name_en: e.target.value })} className={s.input} placeholder={t('Название (англ)', 'Name (En)')} /></td>
                                <td><input value={editData.link || ''} onChange={(e) => setEditData({ ...editData, link: e.target.value })} className={s.input} placeholder="URL" /></td>
                                <td><input value={editData.description || ''} onChange={(e) => setEditData({ ...editData, description: e.target.value })} className={s.input} placeholder={t('Описание (рус)', 'Description (Ru)')} /></td>
                                <td><input value={editData.description_en || ''} onChange={(e) => setEditData({ ...editData, description_en: e.target.value })} className={s.input} placeholder={t('Описание (англ)', 'Description (En)')} /></td>
                                <td>
                                    <Button className={cn(s.btn, s.btn__edit)} view="light" onClick={() => handleSave()}>Сохранить</Button>
                                    <Button className={s.btn} view="light" onClick={cancelAdd}>Отменить</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className={s.addButton}>
                <Button view="dark" onClick={startAdd}>
                    {t(`+ Добавить ${isSources ? 'полезную ссылку' : 'информационного партнера'}`, `+ Add ${isSources ? 'source' : 'partner'}`)}
                </Button>
            </div>

            {/* Модалка подтверждения удаления */}
            {confirmDelete && (
                <div className={s.confirmOverlay} onClick={() => setConfirmDelete(null)}>
                    <div className={s.confirmModal} onClick={e => e.stopPropagation()}>
                        <Text view="title-small" weight="bold">
                            {t('Удалить запись?', 'Delete item?')}
                        </Text>
                        <p className={s.confirmText}>
                            {t('Это действие нельзя отменить.', 'This action cannot be undone.')}
                        </p>
                        <div className={s.confirmButtons}>
                            <Button view="dark" onClick={() => handleDelete(confirmDelete)}>
                                {t('Да', 'Yes')}
                            </Button>
                            <Button view="light" onClick={() => setConfirmDelete(null)}>
                                {t('Отмена', 'Cancel')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}