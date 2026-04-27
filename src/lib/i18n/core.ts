import dictEn from '@/locales/en.json';
import dictRu from '@/locales/ru.json';

function loadDictionary(locale: string) {
    return locale === 'ru' ? dictRu : dictEn;
}

export function createT(locale: string) {
    const dict = loadDictionary(locale);
    
    return (key: string) => {
        const keys = key.split('.');
        let value: any = dict;
        for (const k of keys) {
            if (value === undefined) return key;
            value = value[k];
        }
        return value || key;
    };
}
