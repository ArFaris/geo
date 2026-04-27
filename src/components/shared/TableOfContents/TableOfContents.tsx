'use client'; 
import { useEffect, useState } from 'react';
import Text from '@/components/ui/Text';
import s from './TableOfContents.module.scss';
import Button from '@/components/ui/Button';
import cn from 'classnames';
import type { Articles } from '@/types/articles';
import '@/styles/global.scss';

type TableOfContentsProps = {
    headers: Articles[];
    locale: 'ru' | 'en';
}

const TableOfContents = ({ headers, locale }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState('');

  const scrollToHeader = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 124;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const headings = headers
      .map(block => document.getElementById(block.slug))
      .filter((el: HTMLElement | null) => el !== null);

    console.log(headings)
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
      }
    );

    headings.forEach(heading => observer.observe(heading));

    return () => observer.disconnect();
  }, [headers]);

  let firstLevelInd = 0;
  const renderHeaderItem = (header: Articles, index: number) => {
    firstLevelInd += 1;
    return (
      <div
        key={header.slug || index}
        onClick={() => scrollToHeader(header.slug)}
        className={cn(s.headers__item)}
      >
        <Button view={'dark'} className={s.headers__btn}>{firstLevelInd}</Button>
        <Text className={cn('borderEffect', s.headers__text)}
              view={'p-16'}
              color='primary'>
          {locale === 'ru' ? header.name : header.name_en}
        </Text>
      </div>
    );
  };

  if (!headers || headers.length === 0) return null;

  return (
    <div className={s.sidebar}>
        <Text className={s.sidebar__title} view='subtitle' weight='bold' color='primary'>{locale === 'ru' ? 'Содержание' : 'Table of contents'}</Text>
        <div className={s.headers}>
            {headers.map((header, idx) => renderHeaderItem(header, idx))}
        </div>
    </div>
  );
};

export default TableOfContents;
