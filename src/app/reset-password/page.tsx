'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Text from '@/components/ui/Text';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { UserSchema } from '@/shared/schemas/user.schema';
import { ZodError } from 'zod';
import s from './page.module.scss';

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isReady, setIsReady] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const handleResetSession = async () => {
            const supabase = createClient();
            const code = searchParams.get('code');
            const errorDesc = searchParams.get('error_description');

            if (errorDesc) {
                if (!cancelled) setError('Ссылка недействительна или устарела.');
                setTimeout(() => router.push('/login'), 3000);
                return;
            }

            if (!code) {
                if (!cancelled) setError('Страница доступна только по ссылке из письма.');
                setTimeout(() => router.push('/login'), 3000);
                return;
            }

            const { data, error } = await supabase.auth.exchangeCodeForSession(code);

            if (cancelled) return;

            if (error) {
                console.error('Exchange error:', error);
                setError('Недействительная или просроченная ссылка.');
                setTimeout(() => router.push('/login'), 3000);
                return;
            }

            if (data.session) {
                window.history.replaceState({}, '', '/reset-password');
                setIsReady(true);
            }
        };

        handleResetSession();

        return () => {
            cancelled = true;
        };
    }, []);

    const validatePassword = (password: string): Record<string, string> => {
        try {
            UserSchema.pick({ password: true }).parse({ password });
            return {};
        } catch (error) {
            if (error instanceof ZodError) {
                const errors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    if (err.path[0]) {
                        errors[err.path[0] as string] = err.message;
                    }
                });
                return errors;
            }
            return {};
        }
    };

    const handleUpdatePassword = async () => {
        // Сначала проверяем через схему
        const validationErrors = validatePassword(newPassword);
        
        if (Object.keys(validationErrors).length > 0) {
            setFieldErrors(validationErrors);
            setError('');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setFieldErrors({ confirmPassword: 'Пароли не совпадают' });
            return;
        }
        
        setIsUpdating(true);
        setError('');
        setFieldErrors({});
        
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        
        setIsUpdating(false);
        
        if (error) {
            setError(error.message);
        } else {
            router.push('/profile');
        }
    };

    // Показываем загрузку во время обмена кода
    if (!isReady && !error) {
        return <LoadingScreen locale="ru" />;
    }

    // Если ошибка — показываем сообщение
    if (error && !isReady) {
        return (
            <div className={s.page} style={{ maxWidth: '400px', padding: '2rem' }}>
                <Text view="title-small" weight="bold">Ошибка</Text>
                <Text view="p-16">{error}</Text>
                <Button view="light" onClick={() => router.push('/login')} style={{ marginTop: '1rem' }}>
                    Вернуться ко входу
                </Button>
            </div>
        );
    }

    // Форма смены пароля
    return (
        <div className={s.page} style={{ maxWidth: '400px', padding: '2rem' }}>
            <Text view="title-small" weight="bold">
                Создание нового пароля
            </Text>
            
            <Input
                type="password"
                placeholder="Новый пароль (минимум 6 символов)"
                value={newPassword}
                onChange={(value: string) => {
                    setNewPassword(value);
                    // Очищаем ошибки при вводе
                    if (fieldErrors.password) {
                        setFieldErrors({});
                    }
                }}
                error={!!fieldErrors.password}
            />
            {fieldErrors.password && (
                <Text view="p-14">{fieldErrors.password}</Text>
            )}
            
            <Input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(value: string) => {
                    setConfirmPassword(value);
                    if (fieldErrors.confirmPassword) {
                        setFieldErrors({});
                    }
                }}
                error={!!fieldErrors.confirmPassword}
                style={{ marginTop: '1rem' }}
            />
            {fieldErrors.confirmPassword && (
                <Text view="p-14">{fieldErrors.confirmPassword}</Text>
            )}
            
            {error && <Text view="p-14">{error}</Text>}
            
            <Button 
                loading={isUpdating} 
                view="dark" 
                onClick={handleUpdatePassword}
                style={{ marginTop: '1.5rem', width: '100%' }}
            >
                Сохранить пароль
            </Button>
            
            <Button 
                view="light" 
                onClick={() => router.push('/login')}
                style={{ marginTop: '1rem', width: '100%' }}
            >
                Вернуться ко входу
            </Button>
        </div>
    );
}