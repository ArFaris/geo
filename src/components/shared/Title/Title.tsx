'use client'
import s from './Title.module.scss';
import Text from '@/components/ui/Text';
import cn from 'classnames';
import { createClientT } from '@/lib/i18n/client';

const Title = ({ title, className, locale }: { title: string, className?: string, locale: 'en' | 'ru' }) => {
    const t = createClientT(locale);

    return (
        <header className={cn(s.header, className)}>
            <span className={s.line}></span>
            <Text weight='bold' view='title-small' className={s.title}>{t(`title.${title}`)}</Text>
            <span className={s.line}></span>
        </header>
    )
}

export default Title;
