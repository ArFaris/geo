'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SearchIcon from '@/components/ui/icons/SearchIcon';
import MenuIcon from '@/components/ui/icons/MenuIcon';
import UserIcon from '@/components/ui/icons/UserIcon';import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import BurgerMenu from './components/BurgerMenu';
import useBurgerMenu from '@/hooks/useBurgerMenu';
import s from './Header.module.scss';
import { User } from '@supabase/supabase-js';
import { createClientT } from '@/lib/i18n/client';
import '@/styles/global.scss';

export type Link = {
    key: string,
    to: string
}

const navKeys: Link[] = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.news', to: '/content/news' },
  { key: 'nav.reviews', to: '/content/reviews' },
  { key: 'nav.analytics', to: '/content/analytics' },
  { key: 'nav.articles', to: '/content/articles/vestnik' },
  { key: 'nav.partners', to: '/partners' },
  { key: 'nav.sources', to: '/links' },
  { key: 'nav.shop', to: '/shop' },
  { key: 'nav.about', to: '/about' }
];

type HeaderProps = {
    image?: string,
    links?: Link[],
    locale: 'ru' | 'en';
    user: User | null;
}

const Header: React.FC<HeaderProps> = ({image='/logo.svg', links=navKeys, locale, user}: HeaderProps) => {
    const { isOpen, close, open } = useBurgerMenu();
    const [isSecondLevelVisible, setIsSecondLevelVisible] = useState(true);
    const lastScrollY = useRef(0);
    const frameId = useRef<number>(0);
    const router = useRouter();
    const t = createClientT(locale);

    useEffect(() => {
        const handleScroll = () => {
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
            
            frameId.current = requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY === 0) {
                    setIsSecondLevelVisible(true);
                } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
                    setIsSecondLevelVisible(false);
                } else if (currentScrollY < lastScrollY.current) {
                    setIsSecondLevelVisible(true);
                }
                
                lastScrollY.current = currentScrollY;
            });
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
        };
    }, []);

    const handleNavigate = (to: string) => {
        router.push(to);
    };

    return (
        <>
            <div className={s.header}>
                <div className={s.header__main}>
                    <div className={s.icons}>
                        <SearchIcon />
                        <span className={s.switch}><LanguageSwitcher locale={locale} /></span>
                    </div>

                    <img src={image} alt='Логотип' onClick={() => handleNavigate('/')} className={s.logo}/>

                    {!user && 
                        <div className={cn('buttons', s.headerButtons)}>
                            <Button view='strong' onClick={() => handleNavigate('/registration')}>{t('buttons.register')}</Button>
                            <Button view='strong' onClick={() => handleNavigate('/login')}>{t('buttons.login')}</Button>
                        </div>}

                    {user && <UserIcon className={s.user} onClick={() => handleNavigate('/profile')}/>}

                    <MenuIcon onClick={open} className={s.menu}/>
                </div>

                <div className={cn(s.header__links, {
                    [s.hidden]: !isSecondLevelVisible
                })}>
                    {
                        links.map(link =>
                        <div key={link.to} className={cn('borderEffect', 'borderEffect__light')} onClick={() => handleNavigate(link.to)}>
                            <Text color='primary' view="p-16">
                            {t(link.key)}
                        </Text></div>)
                    }
                </div>
            </div>

            <BurgerMenu onClose={close}
                        isOpen={isOpen}
                        links={links}
                        onLinkClick={(link) => handleNavigate(link.to)}
                        t={t}
                        locale={locale}
                        user={user} />
        </>
    );
}

export default Header;
