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

type ArticleClientProps = {
    article: Article;
    pdfUrl: string | null;
    locale: 'ru' | 'en';
};

const ArticleClient = ({ article, pdfUrl, locale }: ArticleClientProps) => {
    const t = createClientT(locale);

    return (
        <section className={cn('page', s.article)}>
            <PdfViewer pdfUrl={pdfUrl}/>
            
            <div className={s.main}>
                <div>
                    <Text className={s.category}>{t(`nav.${article.category}`)}</Text>
                    <Text weight='bold' view='title-small'>{locale === 'ru' ? `${article.name}` : `${article.name_en}`}</Text>
                </div>

                <div>
                    <Text color='accent'>{locale === 'ru' ? `время чтения: ${article.readingTime} минут` : `Reading time: ${article.readingTime} minutes`}</Text>
                    <div className={s.group}>
                        <Text>{locale === 'ru' ? `${article.views} просмотров` : `${article.views} views`}</Text>
                    </div>
                </div>

                <div className={s.links}>
                    <CopyIcon />
                    <EmailIcon />
                    <MaksIcon />
                </div>
            </div>
        </section>
    );
}

export default ArticleClient;
