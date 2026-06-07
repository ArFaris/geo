'use client';
import { useEffect, useState } from 'react';
import { getUsers } from '@/app/actions/users';  // ← изменён импорт
import Text from '@/components/ui/Text';
import s from './modal.module.scss';

type RegisteredUsersModalProps = {
    onClose: () => void;
    locale: 'ru' | 'en';
};

type UserData = {
    id: string;
    email: string;
    name: string;
    created_at: string;
    last_sign_in_at: string | null;
};

export default function RegisteredUsersModal({ onClose, locale }: RegisteredUsersModalProps) {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const result = await getUsers();
            
            if (result.error) {
                setError(result.error);
                setUsers([]);
            } else {
                setUsers(result.users);
                setError(null);
            }
            
            setLoading(false);
        };
        
        fetchUsers();
    }, []);

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

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US');
    };

    const t = (ru: string, en: string) => locale === 'ru' ? ru : en;

    if (loading) {
        return (
            <div className={s.overlay} onClick={onClose}>
                <div className={`${s.modal} ${s.large}`} onClick={e => e.stopPropagation()}>
                    <div className={s.header}>
                        <Text view="title-small" weight="bold">
                            {t('Зарегистрированные пользователи', 'Registered users')}
                        </Text>
                        <button className={s.close} onClick={onClose}>✕</button>
                    </div>
                    <div className={s.content}>
                        <div className={s.loading}>{t('Загрузка...', 'Loading...')}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={s.overlay} onClick={onClose}>
                <div className={`${s.modal} ${s.large}`} onClick={e => e.stopPropagation()}>
                    <div className={s.header}>
                        <Text view="title-small" weight="bold">
                            {t('Зарегистрированные пользователи', 'Registered users')}
                        </Text>
                        <button className={s.close} onClick={onClose}>✕</button>
                    </div>
                    <div className={s.content}>
                        <div className={s.error}>{t('Ошибка загрузки', 'Loading error')}: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={s.overlay} onClick={onClose}>
            <div className={`${s.modal} ${s.large}`} onClick={e => e.stopPropagation()}>
                <div className={s.header}>
                    <Text view="title-small" weight="bold">
                        {t('Зарегистрированные пользователи', 'Registered users')}
                    </Text>
                    <button className={s.close} onClick={onClose}>✕</button>
                </div>
                <div className={s.content}>
                    {users.length === 0 ? (
                        <div className={s.empty}>{t('Нет пользователей', 'No users')}</div>
                    ) : (
                        <table className={s.table}>
                            <thead>
                                <tr>
                                    <th>{t('Имя', 'Name')}</th>
                                    <th>Email</th>
                                    <th>{t('Дата регистрации', 'Registration date')}</th>
                                    <th>{t('Последний вход', 'Last sign in')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{formatDate(user.created_at)}</td>
                                        <td>{formatDate(user.last_sign_in_at)}</td>
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