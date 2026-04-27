import s from './Title.module.scss';
import Text from '@/components/ui/Text';
import cn from 'classnames';
import { createServerT } from '@/lib/i18n/server';

const Title = async ({ title, className }: { title: string, className?: string }) => {
    const t = await createServerT();

    return (
        <header className={cn(s.header, className)}>
            <span className={s.line}></span>
            <Text weight='bold' view='title-small' className={s.title}>{t(`title.${title}`)}</Text>
            <span className={s.line}></span>
        </header>
    )
}

export default Title;
