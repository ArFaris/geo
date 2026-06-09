'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Text from '@/components/ui/Text';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [mode, setMode] = useState<'loading' | 'reset' | 'error'>('loading');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleCallback = async () => {
            const supabase = createClient();
            
            // Получаем параметры из URL hash
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const type = hashParams.get('type');
            
            // Если есть access_token и тип recovery — это сброс пароля
            if (accessToken && type === 'recovery') {
                // Устанавливаем сессию
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: hashParams.get('refresh_token') || '',
                });
                
                if (error) {
                    console.error('Session error:', error);
                    setMode('error');
                } else {
                    setMode('reset');
                }
                return;
            }
            
            // Обычный колбэк после регистрации/логина
            const { data } = await supabase.auth.getSession();
            if (data.session) {
                router.push('/profile');
                router.refresh();
            } else {
                router.push('/login');
            }
        };

        handleCallback();
    }, [router]);

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        
        if (error) {
            setError(error.message);
        } else {
            router.push('/login');
        }
        setLoading(false);
    };

    if (mode === 'loading') {
        return <LoadingScreen locale={'ru'} />;
    }

    if (mode === 'reset') {
        return (
            <div className="page" style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
                <h1>Создание нового пароля</h1>
                <div style={{ marginTop: '1rem' }}>
                    <Input
                        type="password"
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={(value: string) => setNewPassword(value)}
                        error={!!error}
                    />
                    {error && <Text view="p-14">{error}</Text>}
                </div>
                <Button 
                    loading={loading} 
                    view="dark" 
                    onClick={handleUpdatePassword}
                    style={{ marginTop: '1rem' }}
                >
                    Сохранить пароль
                </Button>
            </div>
        );
    }

    if (mode === 'error') {
        return (
            <div className="page" style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
                <h1>Ошибка</h1>
                <p>Не удалось восстановить пароль. Попробуйте ещё раз.</p>
                <Button view="light" onClick={() => router.push('/login')}>
                    Вернуться на страницу входа
                </Button>
            </div>
        );
    }

    return <LoadingScreen locale={'ru'} />;
}