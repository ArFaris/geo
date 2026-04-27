import * as React from 'react'
import cn from 'classnames';
import s from './Text.module.scss';

export type TextProps = {
    /** Дополнительный класс */
    className?: string;
    /** Стиль отображения */
    view?: 'title-big' | 'title-small' | 'subtitle' | 'button' | 'p-24' | 'p-16' | 'p-14';
    /** Html-тег */
    tag?:  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
    /** Начертание шрифта */
    weight?: 'normal' | 'medium' | 'bold';
    /** Контент */
    children: React.ReactNode;
    /** Цвет */
    color?: 'primary' | 'secondary' | 'accent' | 'gray';
    /** Максимальное кол-во строк */
    maxLines?: number;
};

const Text: React.FC<TextProps> = ({ className, view = 'p-16', tag, weight, children, color = 'primary', maxLines }: TextProps) => {
    const Tag = tag || 'p';

    return (
        <Tag className={cn(s.text, s[`text_view-${view}`], weight && s[`text_weight-${weight}`], color && s[`text_color-${color}`],
            maxLines, className)}
            style={
                { '--max-lines-count': maxLines } as React.CSSProperties
            }
            >{children}</Tag>
    );
};

export default Text;
