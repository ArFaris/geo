'use client'
import Text from '@/components/ui/Text';
import s from './page.module.scss';
import cn from 'classnames';
import CopyIcon from '@/components/ui/icons/CopyIcon';
import EmailIcon from '@/components/ui/icons/EmailIcon';
import MaksIcon from '@/components/ui/icons/MaksIcon';
import PdfViewer from '@/components/shared/PdfViewer';
import { Article } from '@/types/articles';
import { createClientT } from '@/lib/i18n/client';
import '@/styles/global.scss';
import { useEffect, useRef, useState } from 'react';
import { incrementArticleViewsAction } from '@/app/actions/articles';
import { pluralizeViews } from '@/lib/utils/pluralize';

type ArticleClientProps = {
    article: Article;
    pdfPath: string | null;
    locale: 'ru' | 'en';
};

const ArticleClient = ({ article, pdfPath, locale }: ArticleClientProps) => {
    const t = createClientT(locale);
    const [copied, setCopied] = useState(false);
    const hasRecordedView = useRef(false);

    useEffect(() => {
        if (hasRecordedView.current) return;
        hasRecordedView.current = true;

        incrementArticleViewsAction(article.slug).catch(console.error);
    }, [article.slug]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`https://geo-d7.vercel.app/content/${article.category}/${article.subcategory ? `${article.subcategory}/` : ''}${article.slug}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Copy error:', error);
        }
    };
    
    const handleEmail = () => {
        const email = 'fariseeva.a.d@yandex.ru';
        const subject = encodeURIComponent(`Вопрос по статье: ${article.name}`);
        const body = encodeURIComponent(
            `Здравствуйте!\n\nПрочитал(а) вашу статью "${article.name}" и хотел(а) бы задать вопрос:\n\n`
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };
    
    const handleMaks = () => {
        const authorChannelUrl = 'https://maks.ru';
        window.open(authorChannelUrl, '_blank', 'noopener,noreferrer');
    };

    const views = pluralizeViews(article.views, locale);

    return (
        <section className={cn('page', s.article)}>
            <PdfViewer pdfPath={pdfPath}/>
            
            <div className={s.main}>
                <div>
                    <Text className={s.category}>{t(`nav.${article.category}`)}</Text>
                    <Text weight='bold' view='title-small'>{locale === 'ru' ? `${article.name}` : `${article.name_en}`}</Text>
                </div>

                <div>
                    <Text color='accent'>{locale === 'ru' ? `время чтения: ${article.readingTime} минут` : `Reading time: ${article.readingTime} minutes`}</Text>
                    <div className={s.group}>
                        <Text>{views}</Text>
                    </div>
                </div>

                <div className={s.links}>
                    <div className={s.copy}>
                        <CopyIcon onClick={handleCopy} />
                        {copied && <span className={s.tooltip}>{t('other.copied')}</span>}
                    </div>
                    <EmailIcon onClick={handleEmail}/>
                    <MaksIcon onClick={handleMaks}/>
                </div>
            </div>
        </section>
    );
}

export default ArticleClient;
