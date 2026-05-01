import Link from 'next/link';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import s from './not-found.module.scss';
import { getLocale } from '@/lib/i18n/server';
import cn from 'classnames';

export default async function NotFound() {
    const locale = await getLocale();

    return (
        <div className={cn(s.container, 'page')}>
            <div className={s.content}>
                <Text view="title-big" weight="bold" className={s.code}>
                    404
                </Text>
                <Text view="title-small" className={s.title}>
                    {locale === 'ru' ? 'Страница не найдена' : 'Page not found'}
                </Text>
                <Text view="p-16" color="secondary" className={s.description}>
                    {locale === 'ru' ? 'Извините, запрашиваемая страница не существует или была перемещена.' : 'Sorry, the requested page does not exist or has been moved.'}
                </Text>
                <Link href="/">
                    <Button view="dark" className={s.button}>
                        {locale === 'ru' ? 'Вернуться на главную' : 'Return to the main page'}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
