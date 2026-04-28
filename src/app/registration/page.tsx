// src/app/registration/page.tsx
import { Metadata } from 'next';
import { getLocale, createServerT } from '@/lib/i18n/server';
import AuthWrapper from '@/components/shared/AuthWrapper';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/server';

export const metadata: Metadata = {
    title: 'Регистрация | Гео-D7',
    description: 'Создание учётной записи',
};

export default async function RegistrationPage() {
    const user = await getCurrentUser();
    if (user) {
        redirect('/profile');
    }
    
    const locale = await getLocale();
    const t = await createServerT();
    
    const inputsAttributes = [
        { text: t('form.name'), type: 'text', name: 'firstName' },
        { text: t('form.email'), type: 'email', name: 'email' },
        { text: t('form.password'), type: 'password', autoComplete: 'new-password', name: 'password' },
        { text: t('form.repeat'), type: 'password', name: 'copyPassword' },
    ];
    
    return (
        <AuthWrapper 
            type="register" 
            inputsAttributes={inputsAttributes}
            locale={locale}
        />
    );
}
