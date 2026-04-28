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
import { createClientT } from '@/lib/i18n/client';

type ProfileClientProps = {
    user: User;
    locale: 'ru' | 'en';
};

const ProfilePage = ({ user, locale }: ProfileClientProps) => {
    const router = useRouter();
    const t = createClientT(locale);
    const [loading, setLoading] = useState(false);

    const handleSignOutUser = async () => {
        if (loading) return;

        try {
            setLoading(true);
            await signOutUser();
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={s.earth__wrapper}><EarthIcon className={s.earth}/></div>

            <section className={'page'}>
                <Title title={'profile'} locale={locale}/>

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
            </section>
        </>
    );
}

export default ProfilePage;
