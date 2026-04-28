'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZodError } from 'zod';
import Text from '@/components/ui/Text';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Title from '@/components/shared/Title';
import EarthLeftIcon from '@/components/ui/icons/EarthLeft';
import { loginUser, registerUser } from '@/lib/services/auth';
import { UserSchema } from '@/shared/schemas/user.schema';
import { validation } from '@/shared/utils/validation-error';
import s from './AuthWrapper.module.scss';
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
                    password: 'Passwords must match', 
                    copyPassword: 'Passwords must match' 
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
                setErrors({ userNotFound: 'Account not found' });
            } finally {
                setLoading(false);
            }
        }
    };

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
                </div>

                <Button loading={loading} type="submit" view="light" className={s.submit}>
                    {t(`form.${type}`)}
                </Button>
            </div>
        </form>
    );
}
