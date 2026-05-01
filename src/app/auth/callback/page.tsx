'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { getLocale } from '@/lib/i18n/server';

export default async function AuthCallbackPage() {
    const router = useRouter();
    const locale = await getLocale();

    useEffect(() => {
        const handleAuth = async () => {
            const supabase = createClient();
            const { data } = await supabase.auth.getSession();

            if (data.session) {
                router.push('/profile');
                router.refresh();
            } else {
                router.push('/login');
            }
        };

        handleAuth();
    }, [router]);

    return <LoadingScreen locale={locale} />;
}
