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
    
    // Состояния для формы
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isUpdating, setIsUpdating] = useState(false);
    
    // Состояния для шагов
    const [step, setStep] = useState<'loading' | 'otp' | 'newPassword'>('loading');
    const [emailForRecovery, setEmailForRecovery] = useState('');

    useEffect(() => {
        let cancelled = false;

        const handleResetSession = async () => {
            const supabase = createClient();
            const code = searchParams.get('code');
            const errorDesc = searchParams.get('error_description');

            // Если есть ошибка в URL — показываем ошибку
            if (errorDesc) {
                if (!cancelled) {
                    setError('Ссылка недействительна или устарела.');
                    setStep('otp'); // переключаем на OTP-способ
                }
                return;
            }

            // Если есть code — пробуем обменять
            if (code) {
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);

                if (cancelled) return;

                if (error) {
                    console.error('Exchange error:', error);
                    setError('Недействительная или просроченная ссылка.');
                    setStep('otp');
                    return;
                }

                if (data.session) {
                    window.history.replaceState({}, '', '/reset-password');
                    setStep('newPassword');
                    return;
                }
            }

            // Если нет code и нет ошибки — предлагаем OTP
            if (!cancelled) {
                setStep('otp');
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

    // Обработчик OTP-подтверждения
    const handleVerifyOtp = async () => {
        if (!emailForRecovery) {
            setError('Введите email');
            return;
        }

        if (!otpCode || otpCode.length < 6) {
            setError('Введите код из письма (6 цифр)');
            return;
        }

        setIsUpdating(true);
        setError('');

        const supabase = createClient();
        const { data, error } = await supabase.auth.verifyOtp({
            email: emailForRecovery,
            token: otpCode,
            type: 'recovery',
        });

        setIsUpdating(false);

        if (error) {
            console.error('OTP verification error:', error);
            setError('Неверный код. Попробуйте ещё раз.');
        } else if (data?.session) {
            setStep('newPassword');
            setError('');
        } else {
            setError('Ошибка подтверждения. Попробуйте ещё раз.');
        }
    };

    // Обработчик запроса OTP-кода
    const handleRequestOtp = async () => {
        if (!emailForRecovery) {
            setError('Введите email');
            return;
        }

        setIsUpdating(true);
        setError('');

        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(emailForRecovery, {
            redirectTo: 'https://geo-d7.vercel.app/reset-password',
        });

        setIsUpdating(false);

        if (error) {
            console.error('Request OTP error:', error);
            setError('Не удалось отправить код. Попробуйте позже.');
        } else {
            setError('');
            alert('Код для сброса пароля отправлен на ваш email.');
        }
    };

    // Обработчик обновления пароля
    const handleUpdatePassword = async () => {
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

    // ==================== РЕНДЕРИНГ ====================

    // Шаг 1: OTP-подтверждение
    if (step === 'otp') {
        return (
            <div className={s.page} style={{ maxWidth: '400px', padding: '2rem' }}>
                <Text view="title-small" weight="bold">
                    Восстановление пароля
                </Text>
                
                <div style={{ marginTop: '1rem' }}>
                    <Input
                        type="email"
                        placeholder="Ваш email"
                        value={emailForRecovery}
                        onChange={(value: string) => setEmailForRecovery(value)}
                        error={!!error && !otpCode}
                    />
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <Input
                        type="text"
                        placeholder="Код из письма (6 цифр)"
                        value={otpCode}
                        onChange={(value: string) => setOtpCode(value)}
                        error={!!error}
                    />
                    {error && <Text view="p-14">{error}</Text>}
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Button 
                        loading={isUpdating} 
                        view="dark" 
                        onClick={handleVerifyOtp}
                    >
                        Подтвердить код
                    </Button>
                    
                    <Button 
                        view="light" 
                        onClick={handleRequestOtp}
                        disabled={isUpdating}
                    >
                        Отправить код заново
                    </Button>
                    
                    <Button     
                        view="light" 
                        onClick={() => router.push('/login')}
                    >
                        Вернуться ко входу
                    </Button>
                </div>
            </div>
        );
    }

    // Шаг 2: Создание нового пароля
    if (step === 'newPassword') {
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
                        if (fieldErrors.password) {
                            setFieldErrors({});
                        }
                    }}
                    error={!!fieldErrors.password}
                    style={{ marginTop: '1rem' }}
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

    // Загрузка (если ещё не определили шаг)
    return <LoadingScreen locale="ru" />;
}