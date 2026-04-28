'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Text from '@/components/ui/Text';
import Title from '@/components/shared/Title';
import Button from '@/components/ui/Button';
import enDictionary from '@/locales/dict-en.json';
import ruDictionary from '@/locales/dict-ru.json';
import s from './page.module.scss';

interface Term {
    title: string;
    definition: string;
    source: string;
}

interface Dictionary {
    [key: string]: {
        [termKey: string]: Term;
    };
}

type DictionaryClientProps = {
    locale: 'ru' | 'en';
};

const DictionaryPage = ({ locale }: DictionaryClientProps) => {
    const dict = (locale === 'ru' ? ruDictionary : enDictionary) as Dictionary;
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [pendingHash, setPendingHash] = useState<string | null>(null);
    const hasScrolledRef = useRef(false);

    const findLetterByTermKey = useCallback((termKey: string): string | null => {
        for (const [letter, terms] of Object.entries(dict)) {
            if (terms[termKey]) {
                return letter;
            }
        }
        return null;
    }, [dict]);

    const processHash = useCallback(() => {
        const hash = window.location.hash.slice(1);
        if (!hash) return;

        const letter = findLetterByTermKey(hash);
        
        if (letter) {
            setSelectedLetter(letter);
            setPendingHash(hash);
            hasScrolledRef.current = false;
        }
    }, [findLetterByTermKey]);

    useEffect(() => {
        processHash();
        window.addEventListener('hashchange', processHash);
        return () => window.removeEventListener('hashchange', processHash);
    }, [processHash]);

    useEffect(() => {
        if (selectedLetter && pendingHash && !hasScrolledRef.current) {
            const timeoutId = setTimeout(() => {
                const element = document.getElementById(pendingHash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    hasScrolledRef.current = true;
                    setPendingHash(null);
                }
            }, 150);
            return () => clearTimeout(timeoutId);
        }
    }, [selectedLetter, pendingHash]);

    const handleTermClick = (term: string) => {
        window.location.hash = term;
    };

    const handleLetterClick = (symb: string) => {
        setSelectedLetter(symb);
        setPendingHash(null);
        hasScrolledRef.current = false;
        const termsSection = document.getElementById('terms-section');
        if (termsSection) {
            termsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const selectedTerms = selectedLetter ? dict[selectedLetter] : null;

    return (
        <section className={'page'}>
            <Title title={'dict'} locale={locale} />

            <div className={s.symbs}>
                {Object.entries(dict).map(([symb]) => (
                    <Button 
                        key={symb}
                        view='dark'
                        onClick={() => handleLetterClick(symb)}
                    >
                        {symb}
                    </Button>
                ))}
            </div>

            <div id="terms-section" className={s.termsSection}>
                {selectedLetter && selectedTerms ? (
                    <>
                        {Object.entries(selectedTerms).map(([key, value]) => (
                            <div
                                key={key}
                                id={key}
                                className={s.term}
                                onClick={() => handleTermClick(key)}
                            >
                                <Text view="subtitle" weight='bold'>
                                    <a 
                                        href={`#${key}`} 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleTermClick(key);
                                        }}
                                    >
                                        {value.title}
                                    </a>
                                </Text>
                                <Text view="p-16">{value.definition}</Text>
                                {value.source && (
                                    <Text view="p-14" className={s.source}>
                                        {locale === 'ru' ? 'Источник:' : 'Source:'} {value.source}
                                    </Text>
                                )}
                            </div>
                        ))}
                    </>
                ) : (
                    <div className={s.placeholder}>
                        <Text view="p-16" className={s.text}>
                            {locale === 'ru' 
                                ? 'Нажмите на букву, чтобы просмотреть термины' 
                                : 'Click on a letter to view terms'}
                        </Text>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DictionaryPage;
