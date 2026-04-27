'use client';
import { useRouter } from 'next/navigation';
import { setLanguage } from '@/app/actions/language';
import s from './LanguageSwitcher.module.scss';

type LanguageSwitcherProps = {
    locale: 'ru' | 'en';
};

const LanguageSwitcher = ({ locale }: LanguageSwitcherProps) => {
  const router = useRouter();

  const switchLanguage = async (newLocale: 'ru' | 'en') => {
      if (newLocale === locale) return;
      await setLanguage(newLocale);
      router.refresh();
  };

  return (
    <div className={s.switcher}>
      <button
        className={`${s.option} ${locale === 'ru' ? s.active : ''}`}
        onClick={() => switchLanguage('ru')}
      >
        RU
      </button>
      <button
        className={`${s.option} ${locale === 'en' ? s.active : ''}`}
        onClick={() => switchLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
