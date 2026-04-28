'use client'
import Text from '@/components/ui/Text';
import s from './page.module.scss';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import EarthLeftIcon from '@/components/ui/icons/EarthLeft';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Title from '@/components/shared/Title';
import Input from '@/components/ui/Input';
import SearchIcon from '@/components/ui/icons/SearchIcon';
import TableOfContents from '@/components/shared/TableOfContents';
import { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { Articles } from '@/types/articles';
import { createClientT } from '@/lib/i18n/client';
import '@/styles/global.scss';

type ArticlesClientProps = {
    initialArticles: Articles[];
    category: string;
    subcategory?: string;
    locale: 'ru' | 'en';
};

const ArticlesClient = ({ initialArticles, category, subcategory, locale }: ArticlesClientProps) => {
    const t = createClientT(locale);
    const isArticlesCategory = category === 'articles';
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return initialArticles;

        const query = searchQuery.toLowerCase().trim();
        
        return initialArticles.filter(item => {
            const searchField = locale === 'ru' ? item.name : item.name_en;
            return searchField?.toLowerCase().includes(query);
        });
    }, [initialArticles, searchQuery, locale]);

    const debouncedSetSearch = useCallback(
        debounce((value: string) => {
            setSearchQuery(value);
        }, 0),
        []
    );

    return (
        <section className={'page'}>
            <EarthLeftIcon className={s.earh}/>
            
            <Title title={category} locale={locale} />
            {initialArticles && <TableOfContents headers={initialArticles} locale={locale} />}

            <Text className={s.search__title} color='primary' view='subtitle'>{locale === 'ru' ? 'Поиск' : 'Searching'}</Text>
            <Input value={searchQuery} onChange={(e) => debouncedSetSearch(e)} className={s.search} theme='light' afterSlot={<SearchIcon className={s.search__icon}/>}/>

            <div>
                {isArticlesCategory && <div className={s.subcategories}>
                    <Text view='p-16'
                        className={cn('borderEffect', s.subcategory, subcategory === 'vestnik' && s.subcategory__active)} 
                        onClick={() => router.push('/content/articles/vestnik')}>
                            {t('subtitles.vestnik')}
                    </Text>
                    <Text view='p-16' 
                        className={cn('borderEffect', s.subcategory, subcategory === 'other' ? s.subcategory__active : '')} 
                        onClick={() => router.push('/content/articles/other')}>
                            {t('subtitles.other')}
                    </Text>
                </div>}

                <div className={s.articles}>
                    {filteredData.length > 0 && filteredData.map(item => (
                        <article key={item.slug} 
                                 id={item.slug}
                                 onClick={() => router.push(`/content/${category}${subcategory ? `/${subcategory}` : ''}/${item.slug}`)}
                                 className={s.article}>
                            {item.part && <span className={s.article__part}><Text color='primary'>{`${t('common.part')} ${item.part}`}</Text></span>}
                            <Text color='primary'>{locale === 'ru' ? `${item.name}` : `${item.name_en}`}</Text>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ArticlesClient;
