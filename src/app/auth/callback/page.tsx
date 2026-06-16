'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            const supabase = createClient();
            const code = new URLSearchParams(window.location.search).get('code');

            if (code) {
                await supabase.auth.exchangeCodeForSession(code);
            }

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

    return <LoadingScreen locale="ru" />;
}