'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import SearchIcon from '@/components/ui/icons/SearchIcon';
import MenuIcon from '@/components/ui/icons/MenuIcon';
import UserIcon from '@/components/ui/icons/UserIcon';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import BurgerMenu from './components/BurgerMenu';
import useBurgerMenu from '@/hooks/useBurgerMenu';
import s from './Header.module.scss';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import '@/styles/global.scss';

export type Link = {
    key: string,
    to: string
}

const navKeys: Link[] = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.news', to: '/news/all' },
  { key: 'nav.reviews', to: '/reviews/all' },
  { key: 'nav.analytics', to: '/analytics/all' },
  { key: 'nav.articles', to: '/articles/vestnik' },
  { key: 'nav.partners', to: '/partners' },
  { key: 'nav.sources', to: '/sources' },
  { key: 'nav.shop', to: '/shop' },
  { key: 'nav.about', to: '/about' }
];

type HeaderProps = {
    image?: string,
    links?: Link[],
}

const Header: React.FC<HeaderProps> = ({ image = '/logo.png', links = navKeys }: HeaderProps) => {
    const { isOpen, close, open } = useBurgerMenu();
    const [isSecondLevelVisible, setIsSecondLevelVisible] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [locale, setLocale] = useState<'ru' | 'en'>('ru');
    const [loading, setLoading] = useState(true);
    const lastScrollY = useRef(0);
    const frameId = useRef(0);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user || null);

                const match = document.cookie.match(/locale=([^;]+)/);
                setLocale(match ? (match[1] as 'ru' | 'en') : 'ru');
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);

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

    if (loading) {
        return (
            <div className={s.header}>
                <div className={s.header__main}>
                    <div className={s.icons}>
                        <SearchIcon onClick={() => router.push('/search')} className={s.search}/>
                        <img src={image} alt='Логотип' width='80px' className={s.logo__phone}/>
                        <span className={s.switch}><LanguageSwitcher locale="ru" /></span>
                    </div>
                    <div className={s.title__wrapper}>
                        <img src={'/title.svg'} alt='Логотип' width='100px' className={s.title}/>
                        <div className={s.subtitle__wrapper}>
                            <img src={image} alt='Логотип' width='80px' className={s.logo}/>
                            <Text className={s.subtitle} color='secondary'>Open Private Academy of Geodynamics (Hearth)</Text>
                        </div>
                    </div>
                    <MenuIcon onClick={open} className={s.menu}/>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={s.header}>
                <div className={s.header__main}>
                    <div className={s.icons}>
                        <SearchIcon onClick={() => router.push('/search')} className={s.search}/>
                        <img src={image} alt='Логотип' width='80px' className={s.logo__phone}/>
                        <span className={s.switch}><LanguageSwitcher locale={locale} /></span>
                    </div>

                    <div className={s.title__wrapper}>
                        <img src={'/title.svg'} alt='Логотип' width='100px' className={s.title}/>
                        <div className={s.subtitle__wrapper}>
                            <img src={image} alt='Логотип' width='80px' className={s.logo}/>
                            <Text className={s.subtitle} color='secondary'>{locale === 'ru' ? 'Открытая Частная Академия Геодинамики (ОЧАГ)' : 'Open Private Academy of Geodynamics (Hearth)'}</Text>
                        </div>
                    </div>

                    {!user && 
                        <div className={cn('buttons', s.headerButtons)}>
                            <Button view='strong' onClick={() => handleNavigate('/registration')}>Register</Button>
                            <Button view='strong' onClick={() => handleNavigate('/login')}>Login</Button>
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
                            {locale === 'ru' ? link.key : link.key}
                        </Text></div>)
                    }
                </div>
            </div>

            <BurgerMenu onClose={close}
                        isOpen={isOpen}
                        links={links}
                        onLinkClick={(link) => handleNavigate(link.to)}
                        t={(key: string) => key}
                        locale={locale}
                        user={user} />
        </>
    );
}

export default Header;