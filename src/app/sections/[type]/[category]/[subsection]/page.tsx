import { getArticles } from '@/lib/services/sections'; 
import ArticlesClient from '@/app/[type]/ArticlesClient'; 
import { createServerT, getLocale } from '@/lib/i18n/server'; 
import { ArticleCategory } from '@/types/articles';
import Text from '@/components/ui/Text';
import s from './page.module.scss';

type PageProps = { params: Promise<{ type: string, category: ArticleCategory, subsection: string }>; }; 
    
export default async function SectionPage({ params }: PageProps) { 
    const { type, category, subsection } = await params; 
    const locale = await getLocale(); 
    const t = await createServerT();
    const articles = await getArticles({
                                        section: type,
                                        subsection: subsection !== 'all' ? subsection : undefined,
                                        category,
                                    });

    if (!articles.length && category !== 'articles' && type !=='navigation' && type !== 'positioning') { 
        return (<div className={s.empty}>
            <img src={'/killer.png'} width='300px'/>
            <Text view='title-small'>{locale === 'ru' ? 'По данному запросу ничего не найдено' : 'Nothing was found for this query'}</Text>
        </div>);
    }
    
    return <ArticlesClient afterSlot={<Text className={s.subtitle} view='subtitle'>{t(`nav.${category}`)}</Text>} initialArticles={articles} section={type} subsection={subsection} category={category} locale={locale} />; 
}
