import { Metadata } from 'next';
import { getLocale, createServerT } from '@/lib/i18n/server';
import AuthWrapper from '@/components/shared/AuthWrapper';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/server';

export const metadata: Metadata = {
    title: 'Вход | Гео-D7',
    description: 'Вход в личный кабинет',
};

export default async function LoginPage() {
    const user = await getCurrentUser();
    if (user) {
        redirect('/profile');
    }
    
    const locale = await getLocale();
    const t = await createServerT();
    
    const inputsAttributes = [
        { text: t('form.email'), type: 'email', name: 'email' },
        { text: t('form.password'), type: 'password', autoComplete: 'new-password', name: 'password' },
    ];
    
    return (
        <AuthWrapper 
            type="login" 
            inputsAttributes={inputsAttributes}
            locale={locale}
        />
    );
}
