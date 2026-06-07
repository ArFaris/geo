'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';
import Text from '@/components/ui/Text';
import Title from '@/components/shared/Title';
import EarthIcon from '@/components/ui/icons/EarthHoriz';
import { signOutUser } from '@/lib/services/auth';
import s from './page.module.scss';
import '@/styles/global.scss';
import { createClientT } from '@/lib/i18n/client';
import AdminPanel from './AdminPanel';
import cn from 'classnames';

type ProfileClientProps = {
    user: User;
    locale: 'ru' | 'en';
    role: 'user' | 'admin';
};

const ProfilePage = ({ user, locale, role }: ProfileClientProps) => {
    const router = useRouter();
    const t = createClientT(locale);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'admin'>('profile');
    const isAdmin = role === 'admin';

    const handleSignOutUser = async () => {
        if (loading) return;

        try {
            setLoading(true);
            await signOutUser();
            router.push('/login');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={'earth__wrapper'}><EarthIcon className={'earth'}/></div>

            <section className={'page'}>
                <Title title={'profile'} locale={locale}/>

                {isAdmin && (
                    <div className='subcategories'>
                        <Text view='p-16'
                            className={cn('borderEffect', 'subcategory', activeTab === 'profile' && 'subcategory__active')} 
                            onClick={() => setActiveTab('profile')}
                        >
                            {t('profile.settings')}
                        </Text>
                            <Text view='p-16'
                            className={cn('borderEffect', 'subcategory', activeTab === 'admin' && 'subcategory__active')} 
                            onClick={() => setActiveTab('admin')}
                        >
                            {t('profile.admin')}
                        </Text>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className={s.fields}>
                        <div>
                            <Text view='subtitle' weight='medium'>{t('profile.name')}</Text>
                            <Text className={s.field}>{user?.user_metadata?.name ?? '—'}</Text>
                        </div>

                        <div>
                            <Text view='subtitle' weight='medium'>{t('profile.email')}</Text>
                            <Text className={s.field}>{user?.email ?? '-'}</Text>
                        </div>

                        <Button className={s.btn} loading={loading} view='strong' onClick={handleSignOutUser}>{t('profile.out')}</Button>
                    </div>
                )}

                {activeTab === 'admin' && isAdmin && (
                    <AdminPanel user={user} locale={locale} />
                )}
            </section>
        </>
    );
}

export default ProfilePage;
