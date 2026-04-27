'use client';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import Text from '@/components/ui/Text';
import Button from '@/components/ui/Button';
import CloseIcon from '@/components/ui/icons/CloseIcon';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { User } from '@supabase/supabase-js';
import '@/styles/global.scss';
import type { Link } from '../../Header';
import s from './BurgerMenu.module.scss';

type BurgerMenuProps = {
    isOpen: boolean;
    onClose: () => void;
    links: Link[];
    onLinkClick: (link: Link) => void;
    className?: string;
    t: (key: string) => string;
    locale: 'ru' | 'en';
    user: User | null;
};

const BurgerMenu: React.FC<BurgerMenuProps> = ({
    isOpen,
    onClose,
    links,
    onLinkClick,
    className,
    t,
    locale,
    user
}) => {
    const router = useRouter();

    const handleNavigate = (path: string) => {
        onClose();
        router.push(path);
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        let resizeTimer: NodeJS.Timeout;
        const handleResize = () => {
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }

            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 1024) {
                    onClose();
                }
            }, 150);
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
            window.addEventListener('resize', handleResize);
        }

        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('resize', handleResize);

            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
        };
    }, [isOpen, onClose]);

    return createPortal(
        <div className={cn(s.menu, className, isOpen ? s.open : s.close)}>
            <CloseIcon className={s.icon} color="accent" onClick={onClose} />
            <LanguageSwitcher locale={locale} />
            <nav className={s.links}>
                {links.map((link) => (
                    <div
                        key={link.to}
                        onClick={() => {
                            onClose();
                            onLinkClick(link);
                        }}
                        className={cn(s.link, 'borderEffect')}
                    >
                        <Text view="p-16" color="gray">
                            {t(link.key)}
                        </Text>
                    </div>
                ))}
            </nav>

            <div className={cn('buttons', s.menu__buttons)}>
                {!user && (
                    <Button
                        view="dark"
                        className={s.btn}
                        onClick={() => handleNavigate('/registration')}
                    >
                        {t('buttons.register')}
                    </Button>
                )}
                {!user && (
                    <Button
                        view="dark"
                        className={s.btn}
                        onClick={() => handleNavigate('/login')}
                    >
                        {t('buttons.login')}
                    </Button>
                )}
                {user && (
                    <Button
                        view="dark"
                        className={cn(s.btn, s.btn__user)}
                        onClick={() => handleNavigate('/profile')}
                    >
                        {t('buttons.profile')}
                    </Button>
                )}
            </div>
        </div>,
        document.body
    );
};

export default BurgerMenu;
