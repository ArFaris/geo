import Link from 'next/link';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import s from './not-found.module.scss';

export default function NotFound() {
    return (
        <div className={s.container}>
            <div className={s.content}>
                <Text view="title-big" weight="bold" className={s.code}>
                    404
                </Text>
                <Text view="title-small" className={s.title}>
                    Страница не найдена
                </Text>
                <Text view="p-16" color="secondary" className={s.description}>
                    Извините, запрашиваемая страница не существует или была перемещена.
                </Text>
                <Link href="/">
                    <Button view="dark" className={s.button}>
                        Вернуться на главную
                    </Button>
                </Link>
            </div>
        </div>
    );
}
