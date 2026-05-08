import { cookies } from 'next/headers';
import { SITE_CONFIG } from './metadata/home.metadata';
import Header from "@/components/shared/Header";
import '@/styles/global.scss';
import { getCurrentUser } from '@/lib/auth/server';
import LoadingScreen from '@/components/ui/LoadingScreen';

export const metadata = SITE_CONFIG;

async function getLocale(): Promise<'ru' | 'en'> {
    const cookieStore = await cookies();
    const locale = cookieStore.get('locale')?.value;
    return locale === 'en' ? 'en' : 'ru';
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
