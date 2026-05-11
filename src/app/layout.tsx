// app/layout.tsx
import { SITE_CONFIG } from './metadata/home.metadata';
import Header from "@/components/shared/Header";
import '@/styles/global.scss';
import { getCurrentUser } from '@/lib/auth/server';
import { cookies } from 'next/headers';

export const metadata = SITE_CONFIG;
export const dynamic = 'force-dynamic';

async function getLocale(): Promise<'ru' | 'en'> {
    try {
        const cookieStore = await cookies();
        const locale = cookieStore.get('locale')?.value;
        return locale === 'en' ? 'en' : 'ru';
    } catch (error) {
        console.log('No cookies available, using default locale: ru');
        return 'ru';
    }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const user = await getCurrentUser();

  return (
    <html lang={locale}>
      <body>
          <Header locale={locale} user={user} />
          {children}
      </body>
    </html>
  );
}
