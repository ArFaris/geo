'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZodError } from 'zod';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Title from '@/components/shared/Title';
import EarthLeftIcon from '@/components/ui/icons/EarthLeft';
import { loginUser, registerUser, resetPassword } from '@/lib/services/auth';
import { UserSchema } from '@/shared/schemas/user.schema';
import { validation } from '@/shared/utils/validation-error';
import s from './AuthWrapper.module.scss';
import cn from 'classnames';
import { createClientT } from '@/lib/i18n/client';

export type InputAttributes = {
    text: string;
    type: string;
    autoComplete?: string;
    name: string;
};

type AuthWrapperProps = {
    type: 'register' | 'login';
    inputsAttributes: InputAttributes[];
    locale: 'ru' | 'en';
};

export default function AuthWrapper({ type, inputsAttributes, locale }: AuthWrapperProps) {
    const router = useRouter();
    const t = createClientT(locale);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const [showResetForm, setShowResetForm] = useState(false);
    const [resetRequested, setResetRequested] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (loading) return;
        e.preventDefault();
        setErrors({});

        const formData = new FormData(e.currentTarget);

        const userData = {
            name: formData.get('firstName')?.toString() ?? (type === 'login' ? 'nullName' : ''),
            email: formData.get('email')?.toString() || '',
            password: formData.get('password')?.toString() || '',
        };

        try {
            UserSchema.partial().parse(userData);
        } catch (error) {
            if (error instanceof ZodError) {
                const fieldErrors = validation(error);
                setErrors(fieldErrors);
                return;
            }
        }

        if (type === 'register') {
            const copyPassword = formData.get('copyPassword')?.toString() || '';
            if (userData.password !== copyPassword) {
                setErrors({ 
                    password: 'Пароли не совпадают', 
                    copyPassword: 'Пароли не совпадают' 
                });
                return;
            }

            try {
                setLoading(true);
                await registerUser(userData.name, userData.email, userData.password);
                alert('Письмо для подтверждения отправлено на ваш email.');
                router.push('/login');
            } catch (error) {
                console.error(error);
           
                if (error instanceof Error) {
                    const message = error.message;
                    if (message.includes('already registered') || message.includes('User already registered')) {
                        setErrors({ email: 'Пользователь с таким email уже зарегистрирован' });
                    } else if (message.includes('rate limit')) {
                        setErrors({ email: 'Слишком много попыток. Подождите час.' });
                    } else {
                        setErrors({ email: message });
                    }
                } else {
                    setErrors({ email: 'Произошла ошибка при регистрации' });
                }
            } finally {
                setLoading(false);
            }
        } else {
            try {
                setLoading(true);
                await loginUser(userData.email, userData.password);
                router.push('/profile');
                router.refresh();
            } catch (error) {
                console.error(error);
                setErrors({ userNotFound: 'Аккаунт не найден' });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleResetPassword = async () => {
        if (!resetEmail) {
            setErrors({ resetEmail: 'Введите email' });
            return;
        }
        
        setResetRequested(true);
        setLoading(true);
        const { error } = await resetPassword(resetEmail);
        setLoading(false);
        
        if (error) {
            if (error.includes('security purposes') || error.includes('only request')) {
                setErrors({ resetEmail: 'Повторите попытку через минуту' });
            } else {
                setErrors({ resetEmail: error });
            }
            setResetRequested(false);
        } else {
            setResetSent(true);
            setErrors({});
            router.push('/reset-password?sent=true');
        }
    };

    // Форма восстановления пароля
    if (showResetForm) {
        return (
            <div className="page">
                <EarthLeftIcon className={s.earth} />

                <Title title={type} locale={locale} />

                <div className={s.form}>
                    {!resetSent ? (
                        <>
                            <div className={s.fields}>
                                <div className={s.inputBox}>
                                    <Input
                                        type="email"
                                        placeholder={t('form.email')}
                                        value={resetEmail}
                                        onChange={(value: string) => setResetEmail(value)}
                                        error={!!errors.resetEmail}
                                    />
                                    {errors.resetEmail && (
                                        <Text view="p-14" className={s.errorText}>
                                            {errors.resetEmail}
                                        </Text>
                                    )}
                                </div>
                            </div>
                            <div className={s.buttons}>
                                <Button 
                                    className={s.submit} 
                                    loading={loading} 
                                    view="light" 
                                    onClick={handleResetPassword}
                                    disabled={resetRequested}
                                >
                                    {resetRequested ? 'Отправлено' : t('form.reset_password')}
                                </Button>
                                <Button view="dark" onClick={() => {
                                    setShowResetForm(false);
                                    setResetRequested(false);
                                    setResetSent(false);
                                }}>
                                    {t('form.back_to_login')}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Text view="p-16" className={s.successText}>
                                {t('form.reset_email_sent')}
                            </Text>
                            <Button view="light"
                             className={cn(s.submit, s.submit__center)}
                             onClick={() => {
                                setShowResetForm(false);
                                setResetSent(false);
                                setResetRequested(false);
                            }}>
                                {t('form.back_to_login')}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // Обычная форма входа/регистрации
    return (
        <form onSubmit={handleSubmit} className="page">
            <EarthLeftIcon className={s.earth} />

            <Title title={type} locale={locale} />

            <div className={s.form}>
                <div className={s.fields}>
                    {inputsAttributes.map((attr) => (
                        <div key={attr.name} className={s.inputBox}>
                            <Input
                                name={attr.name}
                                autoComplete={attr.autoComplete}
                                placeholder={attr.text}
                                type={attr.type}
                                required
                                error={!!errors[attr.name]}
                            />
                            {errors[attr.name] && (
                                <Text view="p-14" className={s.errorText}>
                                    {errors[attr.name]}
                                </Text>
                            )}
                        </div>
                    ))}
                    {errors.userNotFound && (
                        <Text view="p-14" className={s.errorText}>
                            {errors.userNotFound}
                        </Text>
                    )}
                    {errors.email && (
                        <Text view="p-14" className={s.errorText}>
                            {errors.email}
                        </Text>
                    )}
                </div>

                <div className={s.buttons}>
                    <Button loading={loading} type="submit" view="light" className={s.submit}>
                        {t(`form.${type}`)}
                    </Button>

                    {/* Кнопка "Забыли пароль?" — только для формы входа */}
                    {type === 'login' && (
                        <div className={s.forgotPassword}>
                            <Button className={s.btn} view="light" onClick={() => setShowResetForm(true)}>
                                {t('form.forgot_password')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}