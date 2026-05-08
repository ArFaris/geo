'use client'
import Text from '@/components/ui/Text';
import s from './page.module.scss';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import EarthLeftIcon from '@/components/ui/icons/EarthLeft';
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
    afterSlot?: React.ReactNode;
};

const ArticlesClient = ({ initialArticles, category, subcategory, locale, afterSlot }: ArticlesClientProps) => {
    const t = createClientT(locale);
    const isArticlesCategory = category === 'articles';
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [articles, setArticles] = useState<Articles[]>(initialArticles);
    const isSearch = category === 'search';

    useMemo(() => {
        if (!searchQuery.trim()) return initialArticles;

        const query = searchQuery.toLowerCase().trim();
        
        const filteredData = initialArticles.filter(item => {
            const searchField = locale === 'ru' ? item.name : item.name_en;
            return searchField?.toLowerCase().includes(query);
        });
        setArticles(filteredData);
    }, [initialArticles, searchQuery, locale]);

    const debouncedSetSearch = useCallback(
        debounce((value: string) => {
            setSearchQuery(value);
        }, 0),
        []
    );

    const handleSearch = async () => {
        if (category === 'search') {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
            const results = await response.json();

            setArticles(results);
        }
    }

    return (
        <section className={'page'}>
            <EarthLeftIcon className={s.earh}/>
            
            <Title title={category} locale={locale} afterSlot={afterSlot} />
            {initialArticles && <TableOfContents headers={initialArticles} locale={locale} />}

            {!isSearch && <Text className={s.search__title} color='primary' view='subtitle'>{locale === 'ru' ? 'Поиск' : 'Searching'}</Text>}
            <Input placeholder={locale === 'ru' ? 'Введите текст' : 'Enter text'} value={searchQuery} onChange={(e) => debouncedSetSearch(e)} className={cn('search', isSearch && s.searchPage)} theme='light' afterSlot={<SearchIcon onClick={handleSearch} className={'search__icon'}/>}/>

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
                    {articles.length > 0 && articles.map(item => (
                        <article key={item.slug} 
                                 id={item.slug}
                                 onClick={() => router.push(`/content/${item.category}${subcategory ? `/${subcategory}` : ''}/${item.slug}`)}
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
