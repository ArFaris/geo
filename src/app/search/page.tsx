import ArticlesClient from "../[type]/ArticlesClient";
import { getLocale } from "@/lib/i18n/server";

export default async function Search() {
    const locale = await getLocale();

    return <ArticlesClient locale={locale} initialArticles={[]} category={'search'} />
}
