import '@/styles/global.scss';
import { getAllLinks } from "@/lib/services/links";
import LinksWrapper from "@/components/shared/LinksWrapper";
import { getLocale } from "@/lib/i18n/server";

export default async function Links() {
    const sources = await getAllLinks('sources');
    const locale = await getLocale();

    return (
        <LinksWrapper title='sources' locale={locale} links={sources} />
    ); 
}
