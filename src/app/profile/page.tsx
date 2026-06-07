import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser, getUserRole } from '@/lib/auth/server';
import { getLocale } from '@/lib/i18n/server';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
    title: 'Профиль | Гео-D7',
    description: 'Управление профилем пользователя',
};

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/login');
    }

    const role = await getUserRole(user);
    const locale = await getLocale();
    
    return (
        <ProfileClient 
            user={user}
            locale={locale}
            role={role}
        />
    );
}
