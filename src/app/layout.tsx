import Header from "@/components/shared/Header";
import { getLocale } from "@/lib/i18n/server";
import '@/styles/global.scss';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang="ru">
      <body>
        <Header locale={locale}/>
        {children}
      </body>
    </html>
  );
}
