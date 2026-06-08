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
import { incrementArticleViewsAction, incrementArticleDownloadsAction } from '@/app/actions/articles';
import { pluralizeViews } from '@/lib/utils/pluralize';
import { User } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';

type ArticleClientProps = {
    article: Article;
    pdfPath: string | null;
    locale: 'ru' | 'en';
    user: User | null;
};

const ArticleClient = ({ article, pdfPath, locale, user }: ArticleClientProps) => {
    const t = createClientT(locale);
    const [copied, setCopied] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const hasRecordedView = useRef(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Определяем, является ли пользователь админом (только для UI)
    const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';

    // Просмотр — сервер сам проверит админа
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
        const email = 'vdo-vladimir@yandex.ru';
        const subject = encodeURIComponent(`Вопрос по статье: ${article.name}`);
        const body = encodeURIComponent(
            `Здравствуйте!\n\nПрочитал(а) вашу статью "${article.name}" и хотел(а) бы задать вопрос:\n\n`
        );
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    };
    
    const handleMaks = () => {
        const authorChannelUrl = 'https://t.me/VVS19582025';
        window.open(authorChannelUrl, '_blank', 'noopener,noreferrer');
    };

    const handleDownload = async () => {
        if (!pdfPath || isDownloading) return;
        
        setIsDownloading(true);
        
        try {
            // Сервер сам проверит, админ ли, и увеличит счётчик только для обычных пользователей
            await incrementArticleDownloadsAction(article.slug);
            
            const downloadUrl = `/api/pdf?path=${encodeURIComponent(pdfPath)}&download=true`;
            
            const response = await fetch(downloadUrl);
            
            if (!response.ok) {
                throw new Error('Download failed');
            }
            
            const blob = await response.blob();
            const fileName = `${article.name}.pdf`;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const views = pluralizeViews(article.views, locale);

    return (
        <section className={cn('page', s.article)}>
            <PdfViewer pdfPath={pdfPath} locale={locale} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
            
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

                <div className={cn(s.links, s.links__btns)}>
                    {user && (
                        <Button 
                            view='dark' 
                            onClick={handleDownload} 
                            className={s.download}
                            loading={isDownloading}
                        >
                            {t('buttons.download')}
                        </Button>
                    )}
                    <Button onClick={() => setIsFullScreen(true)} view='light' className={s.fullScreen}>
                        {t('other.fullScreen')}
                    </Button>
                </div>

                {!user && <Text>{locale === 'ru' ? 'Скачивание PDF доступно после регистрации.' : 'PDF download is available after registration.'}</Text>}
            </div>
        </section>
    );
}

export default ArticleClient;