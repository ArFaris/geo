import EarthLeftIcon from "@/components/ui/icons/EarthLeft";
import { Link } from "@/types/link";
import s from './LinksWrapper.module.scss';
import Text from "@/components/ui/Text";
import '@/styles/global.scss';
import { createServerT } from "@/lib/i18n/server";
import cn from 'classnames';

type LinksWrapperProps = {
    title: string;
    locale: 'ru' | 'en';
    links: Link[];
}

const LinksWrapper: React.FC<LinksWrapperProps> = async ({ title, locale, links }: LinksWrapperProps) => {
    const t = await createServerT();

    return (
        <section className={'page'}>
            <EarthLeftIcon className={s.earth} />

            <div className={s.main}>
                <Text weight='bold' view='title-small' className={s.title}>{t(`title.${title}`)}</Text>

                <div className={cn(s.links, title === 'partners' && s.partners)}>
                    {
                        links.map(link => 
                            <div className={s.link}>
                                <Text weight="bold">{locale === 'ru' ? link.name : link.name_en}</Text>

                                <a className={s.a} href={link.link}>{link.link}</a>

                                {link.description && <Text>{locale === 'ru' ? link.description : link.description_en}</Text>}
                            </div>
                        )
                    }
                </div>
            </div>
        </section>
    ); 
}

export default LinksWrapper;
