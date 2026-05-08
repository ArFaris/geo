'use client'
import s from './Title.module.scss';
import Text from '@/components/ui/Text';
import cn from 'classnames';
import { createClientT } from '@/lib/i18n/client';

type TitleProps = {
    title: string;
    className?: string;
    locale: 'en' | 'ru';
    afterSlot?: React.ReactNode;
}

const Title = ({ title, className, locale, afterSlot }: TitleProps) => {
    const t = createClientT(locale);

    return (
        <header className={cn(s.header, className)}>
            <span className={'line'}></span>
            <div>
                <Text weight='bold' view='title-small' className={s.title}>{t(`title.${title}`)}</Text>
                {afterSlot}
            </div>
            <span className={'line'}></span>
        </header>
    )
}

export default Title;
