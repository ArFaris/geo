import { createClient } from "../supabase/server"

export const getAllLinks = async (category: string) => {
    const supabase = await createClient();

        const query = supabase
                    .from(category)
                    .select('*');
    
    const { data, error } = await query;

    if (error) throw new Error(`Error in getAllLink: ${error.message}`)

    return (data || []).map((item) => ({
        name: item.name,
        name_en: item.name_en,
        link: item.link,
        description: item?.description,
        description_en: item?.description_en
    }));
}
